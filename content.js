// Content script: bridges the page (inject.js) and the service worker.

function toBase64(buffer) {
  const bytes = new Uint8Array(buffer);
  let binary = "";
  const chunkSize = 0x8000;
  for (let offset = 0; offset < bytes.length; offset += chunkSize) {
    binary += String.fromCharCode.apply(null, bytes.subarray(offset, offset + chunkSize));
  }
  return btoa(binary);
}

function notifyBackground(message) {
  chrome.runtime.sendMessage(message).catch(() => {
    // The worker may be restarting; the next navigation will report again.
  });
}

// A new top level navigation starts a fresh collection in the worker.
if (window === window.parent) {
  notifyBackground({ type: "RESET" });
}

document.addEventListener("pssh", (event) => {
  notifyBackground({ type: "PSSH", text: event.detail });
});

document.addEventListener("clearkey", (event) => {
  notifyBackground({ type: "CLEARKEY", text: event.detail });
});

// License requests have to be sent from the page itself, otherwise the original
// origin, cookies and referrer are lost.
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.type !== "FETCH") return undefined;

  fetch(request.u, {
    method: request.m,
    headers: JSON.parse(request.h),
    body: Uint8Array.from(atob(request.b), (char) => char.charCodeAt(0)),
  })
    .then((response) => response.arrayBuffer())
    .then((buffer) => sendResponse({ data: toBase64(buffer) }))
    .catch((error) => sendResponse({ error: String(error?.message ?? error) }));

  return true;
});
