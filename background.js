// Persistent variables in global scope (will be lost if worker suspends)
// To prevent data loss, consider using chrome.storage.session
let psshs = [];
let requests = [];
let bodys = [];
let targetIds = [];
let pageURL = "";
let clearkey = "";
let isBlock = false;
let blockRules = [];

async function init() {
    chrome.storage.local.get("isBlock", (value) => {
        isBlock = value.isBlock || false;
    });

    try {
        const response = await fetch(chrome.runtime.getURL("blockRules.conf"));
        const text = await response.text();
        blockRules = text.replace(/\n^\s*$|\s*\/\/.*|\s*$/gm, "").split("\n");
    } catch (e) {
        console.warn("Failed to load blockRules.conf", e);
    }
}

init();

function convertHeaders(obj) {
    return JSON.stringify(Object.fromEntries(obj.map(header => [header.name, header.value])));
}

function testBlock(url) {
    return isBlock && blockRules.some(e => url.includes(e));
}

// Get URL and headers from POST requests
// Note: 'blocking' is not supported in MV3 for standard extensions.
// For observation, use 'requestHeaders'. For blocking, use declarativeNetRequest.
const webRequestOptions = ["requestHeaders"];
// if you have webRequestBlocking permission and are on a supported environment:
// webRequestOptions.push("extraHeaders");

chrome.webRequest.onBeforeSendHeaders.addListener(
    function(details) {
        if (details.method === "POST") {
            const bodyObj = bodys.find((b) => b.id == details.requestId);
            requests.push({
                url: details.url,
                headers: convertHeaders(details.requestHeaders),
                body: bodyObj ? bodyObj.body : ""
            });
            if (testBlock(details.url)) {
                // In MV3, this will NOT work without declarativeNetRequest
                // return {cancel:true}
                console.log("Blocking request: " + details.url);
            }
        }
    },
    { urls: ["<all_urls>"] },
    webRequestOptions
);

// Get requestBody from POST requests
chrome.webRequest.onBeforeRequest.addListener(
    function(details) {
        if (details.method === "POST" && details.requestBody && details.requestBody.raw) {
            bodys.push({
                body: btoa(String.fromCharCode(...new Uint8Array(details.requestBody.raw[0]['bytes']))),
                id: details.requestId
            });
        }
    },
    { urls: ["<all_urls>"] },
    ["requestBody"]
);

// Receive messages from content.js
chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {
        switch (request.type) {
            case "RESET":
                psshs = [];
                requests = [];
                bodys = [];
                targetIds = [];
                pageURL = "";
                clearkey = "";
                break;
            case "PSSH":
                psshs.push(request.text);
                pageURL = sender.tab.url;
                targetIds = [sender.tab.id, sender.frameId];
                break;
            case "CLEARKEY":
                clearkey = request.text;
                break;
            case "GET_DATA": // Added helper for popup
                sendResponse({psshs, requests, bodys, targetIds, pageURL, clearkey});
                break;
        }
        return true;
    }
);

// Popup is now handled natively via default_popup in manifest.json

function createMenu() {
    chrome.storage.local.set({ 'isBlock': false });
    chrome.contextMenus.create({
        id: "toggleBlocking",
        title: "Enable License Blocking",
        contexts: ["all"]
    }, () => {
        if (chrome.runtime.lastError) {
            // Ignore error if menu already exists
        }
    });
}

chrome.runtime.onInstalled.addListener(createMenu);
chrome.runtime.onStartup.addListener(createMenu);

chrome.contextMenus.onClicked.addListener(item => {
    if (item.menuItemId == "toggleBlocking") {
        chrome.storage.local.get("isBlock", (value) => {
            const newState = !value.isBlock;
            chrome.storage.local.set({ 'isBlock': newState });
            chrome.contextMenus.update("toggleBlocking", {
                title: newState ? "Disable License Blocking" : "Enable License Blocking"
            });
            isBlock = newState;
        });
    }
});

