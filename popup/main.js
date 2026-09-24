// Popup controller.
// It reads the collected state from the service worker, asks the page for
// license responses and runs the Python side through Pyodide. Because the
// popup is a normal browser action popup it closes as soon as it loses focus,
// so everything needed to rebuild the view is kept in session storage.

const UI_KEY = "wvgUi";

const WHEELS = [
  "certifi-2024.2.2-py3-none-any.whl",
  "charset_normalizer-3.3.2-py3-none-any.whl",
  "construct-2.8.8-py2.py3-none-any.whl",
  "idna-3.6-py3-none-any.whl",
  "packaging-23.2-py3-none-any.whl",
  "protobuf-4.24.4-cp312-cp312-emscripten_3_1_52_wasm32.whl",
  "pycryptodome-3.20.0-cp35-abi3-emscripten_3_1_52_wasm32.whl",
  "pymp4-1.4.0-py3-none-any.whl",
  "pyodide_http-0.2.1-py3-none-any.whl",
  "pywidevine-1.8.0-py3-none-any.whl",
  "requests-2.31.0-py3-none-any.whl",
  "urllib3-2.2.1-py3-none-any.whl",
];

const wvg = {
  psshs: [],
  requests: [],
  clearkey: "",
  pageURL: "",
  targetIds: null,
  userInputs: {},
};
window.wvg = wvg;

let pyodide = null;
let isRunning = false;
let hasData = false;
let initializing = false;

const el = (id) => document.getElementById(id);

function show(id) {
  el(id).style.display = "grid";
}

function hide(id) {
  el(id).style.display = "none";
}

function setStatus(text) {
  el("status").textContent = text ?? "";
}

function extensionFile(path) {
  return fetch(chrome.runtime.getURL(path)).then((response) => response.text());
}

async function requestState() {
  const response = await chrome.runtime.sendMessage({ type: "GET_STATE" });
  if (response?.error) throw new Error(response.error);
  return response.state;
}

function applyState(state) {
  wvg.psshs = state.psshs ?? [];
  wvg.requests = state.requests ?? [];
  wvg.clearkey = state.clearkey ?? "";
  wvg.pageURL = state.pageURL ?? "";
  wvg.targetIds = state.targetIds ?? null;
}

async function readUiState() {
  const stored = await chrome.storage.session.get(UI_KEY);
  return stored[UI_KEY] ?? null;
}

async function saveUiState() {
  await chrome.storage.session.set({
    [UI_KEY]: {
      running: isRunning,
      scheme: el("schemeSelect").value,
      licenseUrl: el("license").value,
      result: el("result").value,
    },
  });
}

function selectLicenseRequest(index) {
  wvg.userInputs.license = index;
  el("license").value = wvg.requests[index].url;
}

async function autoSelect() {
  if (!wvg.requests.length) return;

  selectLicenseRequest(0);

  const rules = (await extensionFile("selectRules.conf"))
    .replace(/\n^\s*$|\s*\/\/.*|\s*$/gm, "")
    .split("\n")
    .filter(Boolean)
    .map((row) => row.split("$$"));

  for (const [pattern, scheme] of rules) {
    const index = wvg.requests.findIndex((request) => request.url.includes(pattern));
    if (index < 0) continue;
    if (scheme) el("schemeSelect").value = scheme;
    selectLicenseRequest(index);
    break;
  }
}

async function restoreLicenseRequest(uiState) {
  const storedUrl = uiState?.licenseUrl;
  const index = storedUrl ? wvg.requests.findIndex((request) => request.url === storedUrl) : -1;

  if (index >= 0) {
    selectLicenseRequest(index);
    return;
  }
  await autoSelect();
}

async function init() {
  if (initializing) return;
  initializing = true;

  try {
    const state = await requestState();
    applyState(state);
    const uiState = await readUiState();

    if (wvg.clearkey) {
      hide("noEME");
      show("ckHome");
      el("ckResult").value = wvg.clearkey;
      hasData = true;
      return;
    }

    if (!wvg.psshs.length) {
      el("noEME").style.display = "block";
      return;
    }

    hasData = true;
    hide("noEME");
    show("home");
    el("pssh").value = wvg.psshs[0];
    if (uiState?.result) el("result").value = uiState.result;
    if (uiState?.scheme) el("schemeSelect").value = uiState.scheme;
    await restoreLicenseRequest(uiState);
    // Loading the scheme file is what editScheme.js listens for.
    el("schemeSelect").dispatchEvent(new Event("input"));
    if (uiState?.running) {
      setStatus("The previous run was cut off when the popup closed. Press Guess! again.");
    }
  } finally {
    initializing = false;
  }
}

async function guess() {
  if (isRunning) return;

  const pssh = el("pssh").value.trim();
  const licenseRequest = wvg.requests[wvg.userInputs.license];
  const scheme = el("schemeCode").value;

  if (!pssh) {
    setStatus("No PSSH captured yet. Start playback first.");
    return;
  }
  if (!licenseRequest) {
    setStatus("No license request selected.");
    return;
  }
  if (!scheme.trim()) {
    setStatus("The challenge scheme is still loading. Try again in a moment.");
    return;
  }

  isRunning = true;
  el("guess").disabled = true;
  document.body.style.cursor = "wait";
  await saveUiState();

  try {
    setStatus("Loading the Python runtime...");
    pyodide ??= await loadPyodide();
    await pyodide.loadPackage(WHEELS.map((wheel) => `/libs/wheels/${wheel}`));

    pyodide.globals.set("pssh", pssh);
    pyodide.globals.set("licUrl", licenseRequest.url);
    pyodide.globals.set("licHeaders", licenseRequest.headers);
    pyodide.globals.set("licBody", licenseRequest.body);

    const [pre, after] = await Promise.all([extensionFile("python/pre.py"), extensionFile("python/after.py")]);

    setStatus("Requesting the license...");
    const result = await pyodide.runPythonAsync([pre, scheme, after].join("\n"));

    el("result").value = result ?? "";
    setStatus("Done. Click the result to copy it.");

    if (wvg.pageURL) {
      await chrome.storage.local.set({
        [wvg.pageURL]: { PSSH: pssh, KEYS: String(result ?? "").split("\n").slice(0, -1) },
      });
    }
  } catch (error) {
    // The Python side writes a readable diagnosis into the result box, so only
    // fall back to the raw message when nothing was written.
    if (!el("result").value) el("result").value = String(error?.message ?? error);
    setStatus("Failed. See the result box for details.");
  } finally {
    isRunning = false;
    el("guess").disabled = false;
    document.body.style.cursor = "auto";
    await saveUiState();
  }
}

function copyResult(event) {
  const target = event.currentTarget;
  target.select();
  navigator.clipboard.writeText(target.value);
}

// Used by python/pre.py to drop the license block rules while the license is
// being fetched, otherwise the request would be blocked by this extension.
window.setLicenseBlocking = (value) => chrome.runtime.sendMessage({ type: "SET_BLOCKING", value });

// Used by python/pre.py through corsFetch().
window.corsFetch = (url, method, headers, body) =>
  new Promise((resolve, reject) => {
    const target = wvg.targetIds;
    if (!target) {
      reject(new Error("The tab that produced the PSSH is gone."));
      return;
    }

    chrome.tabs.sendMessage(target[0], { type: "FETCH", u: url, m: method, h: headers, b: body }, { frameId: target[1] }, (response) => {
      if (chrome.runtime.lastError) {
        reject(new Error(chrome.runtime.lastError.message));
        return;
      }
      if (!response) {
        reject(new Error("The page did not answer the license request."));
        return;
      }
      if (response.error) {
        reject(new Error(response.error));
        return;
      }
      resolve(response.data);
    });
  });

el("guess").addEventListener("click", guess);
el("result").addEventListener("click", copyResult);
el("ckResult").addEventListener("click", copyResult);
el("schemeSelect").addEventListener("input", () => void saveUiState());

// A playback that only starts after the popup was opened still has to show up.
chrome.storage.session.onChanged.addListener((changes) => {
  if (!changes.wvgState || hasData || isRunning) return;
  applyState(changes.wvgState.newValue ?? {});
  void init();
});

void init().catch((error) => {
  el("noEME").textContent = `Could not read the collected requests: ${error?.message ?? error}`;
});
