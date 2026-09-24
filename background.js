// Manifest V3 service worker.
// It collects the PSSH values and POST requests of every frame into session
// storage, which is what the popup reads. Nothing is kept in a long living
// page anymore, so the worker may be stopped between events.

const STATE_KEY = "wvgState";
const MENU_ID = "toggleBlocking";
const BLOCK_RULE_ID_START = 1000;
const MAX_REQUESTS = 200;
const MAX_BODIES = 500;

const emptyState = () => ({
  psshs: [],
  requests: [],
  clearkey: "",
  pageURL: "",
  targetIds: null,
});

let state = emptyState();
let hydration = null;
let requestBodies = new Map();
let saveTimer = null;
let savedSignature = null;

function ensureState() {
  if (hydration === null) {
    hydration = chrome.storage.session.get(STATE_KEY).then((stored) => {
      state = stored[STATE_KEY] ?? emptyState();
      savedSignature = JSON.stringify(state);
      return state;
    });
  }
  return hydration;
}

async function saveState() {
  // Writing an unchanged value would still wake every listener, so the state is
  // only written when something actually moved.
  const signature = JSON.stringify(state);
  if (signature === savedSignature) return;
  savedSignature = signature;
  await chrome.storage.session.set({ [STATE_KEY]: state });
}

function scheduleSave() {
  if (saveTimer !== null) clearTimeout(saveTimer);
  saveTimer = setTimeout(() => {
    saveTimer = null;
    void saveState();
  }, 150);
}

async function flushState() {
  if (saveTimer !== null) {
    clearTimeout(saveTimer);
    saveTimer = null;
  }
  await saveState();
}

function toBase64(buffer) {
  const bytes = new Uint8Array(buffer);
  let binary = "";
  const chunkSize = 0x8000;
  for (let offset = 0; offset < bytes.length; offset += chunkSize) {
    binary += String.fromCharCode.apply(null, bytes.subarray(offset, offset + chunkSize));
  }
  return btoa(binary);
}

function headersToJson(headers) {
  const pairs = (headers ?? []).map((header) => [header.name, header.value]);
  return JSON.stringify(Object.fromEntries(pairs));
}

// The body of a request is only available in onBeforeRequest, the headers only
// in onBeforeSendHeaders. The body is parked under the request id until the
// second event picks it up.
chrome.webRequest.onBeforeRequest.addListener(
  (details) => {
    if (details.method !== "POST") return;
    const raw = details.requestBody?.raw?.[0]?.bytes;
    requestBodies.set(details.requestId, raw ? toBase64(raw) : "");
    while (requestBodies.size > MAX_BODIES) {
      requestBodies.delete(requestBodies.keys().next().value);
    }
  },
  { urls: ["<all_urls>"] },
  ["requestBody"]
);

chrome.webRequest.onBeforeSendHeaders.addListener(
  (details) => {
    if (details.method !== "POST") return;
    const body = requestBodies.get(details.requestId) ?? "";
    requestBodies.delete(details.requestId);
    void recordRequest(details.url, headersToJson(details.requestHeaders), body);
  },
  { urls: ["<all_urls>"] },
  ["requestHeaders"]
);

async function recordRequest(url, headers, body) {
  await ensureState();
  state.requests.push({ url, headers, body });
  if (state.requests.length > MAX_REQUESTS) {
    state.requests.splice(0, state.requests.length - MAX_REQUESTS);
  }
  scheduleSave();
}

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  handleMessage(message, sender)
    .then((response) => sendResponse(response))
    .catch((error) => sendResponse({ error: String(error?.message ?? error) }));
  return true;
});

async function handleMessage(message, sender) {
  await ensureState();

  switch (message?.type) {
    case "RESET":
      // A new top level navigation invalidates everything collected so far.
      state = emptyState();
      requestBodies.clear();
      await flushState();
      return { ok: true };

    case "PSSH":
      if (message.text && !state.psshs.includes(message.text)) {
        state.psshs.push(message.text);
      }
      if (sender.tab?.url) state.pageURL = sender.tab.url;
      if (sender.tab?.id !== undefined) {
        state.targetIds = [sender.tab.id, sender.frameId ?? 0];
      }
      await flushState();
      return { ok: true };

    case "CLEARKEY":
      state.clearkey = message.text ?? "";
      await flushState();
      return { ok: true };

    case "GET_STATE":
      // The in memory state is the source of truth while the worker is awake,
      // so this answers without touching storage.
      return { state };

    case "SET_BLOCKING":
      await setBlocking(Boolean(message.value));
      return { ok: true };

    default:
      return { error: `Unknown message type: ${message?.type}` };
  }
}

// License blocking used to be a blocking webRequest listener. Manifest V3 only
// allows declarative rules, so blockRules.conf is translated into dynamic
// declarativeNetRequest rules instead.
function menuTitle(isBlock) {
  return isBlock ? "Disable License Blocking" : "Enable License Blocking";
}

async function loadBlockPatterns() {
  const text = await fetch(chrome.runtime.getURL("blockRules.conf")).then((response) => response.text());
  return text
    .replace(/\n^\s*$|\s*\/\/.*|\s*$/gm, "")
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);
}

// urlFilter gives these characters a special meaning, so such lines are skipped
// instead of being turned into rules that match something else.
const hasUrlFilterSyntax = (pattern) => /[*|^[\]]/.test(pattern);

async function applyBlockRules(enabled) {
  const existing = await chrome.declarativeNetRequest.getDynamicRules();
  const removeRuleIds = existing
    .filter((rule) => rule.id >= BLOCK_RULE_ID_START)
    .map((rule) => rule.id);

  const addRules = [];
  if (enabled) {
    for (const pattern of await loadBlockPatterns()) {
      if (hasUrlFilterSyntax(pattern)) {
        console.warn(`[WVG] Skipped license block pattern: ${pattern}`);
        continue;
      }
      addRules.push({
        id: BLOCK_RULE_ID_START + addRules.length,
        priority: 1,
        action: { type: "block" },
        condition: { urlFilter: pattern, requestMethods: ["post"] },
      });
    }
  }

  await chrome.declarativeNetRequest.updateDynamicRules({ removeRuleIds, addRules });
}

async function createMenu() {
  const { isBlock = false } = await chrome.storage.local.get("isBlock");
  await chrome.contextMenus.removeAll();
  chrome.contextMenus.create({ id: MENU_ID, title: menuTitle(isBlock) });
}

async function updateMenuTitle(isBlock) {
  try {
    await chrome.contextMenus.update(MENU_ID, { title: menuTitle(isBlock) });
  } catch {
    await createMenu();
  }
}

async function setBlocking(enabled) {
  await chrome.storage.local.set({ isBlock: enabled });
  await applyBlockRules(enabled);
  await updateMenuTitle(enabled);
}

chrome.contextMenus.onClicked.addListener(async (info) => {
  if (info.menuItemId !== MENU_ID) return;
  const { isBlock = false } = await chrome.storage.local.get("isBlock");
  await setBlocking(!isBlock);
});

async function reconcileBlocking() {
  const { isBlock = false } = await chrome.storage.local.get("isBlock");
  await createMenu();
  await applyBlockRules(isBlock);
}

chrome.runtime.onInstalled.addListener(async () => {
  await chrome.storage.local.set({ isBlock: false });
  await reconcileBlocking();
});

chrome.runtime.onStartup.addListener(() => {
  void reconcileBlocking();
});
