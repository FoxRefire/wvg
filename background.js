(async () => {
window.psshs=[];
window.requests=[];
window.bodys=[];
window.targetIds=[];
window.pageURL="";
window.clearkey="";

chrome.storage.local.get("isBlock", (value) => {
    window.isBlock = value.isBlock;
})

function convertHeaders(obj){
    return JSON.stringify(Object.fromEntries(obj.map(header => [header.name, header.value])))
}

window.blockRules = await fetch("blockRules.conf").then((r)=>r.text());
window.blockRules = window.blockRules.replace(/\n^\s*$|\s*\/\/.*|\s*$/gm, "").split("\n");
function testBlock(url) {
    return window.isBlock && window.blockRules.some(e => url.includes(e));
}

//Get URL and headers from POST requests
chrome.webRequest.onBeforeSendHeaders.addListener(
    function(details) {
        if (details.method === "POST") {
            window.requests.push({
                url:details.url,
                headers:convertHeaders(details.requestHeaders),
                body:window.bodys.find((b) => b.id == details.requestId).body
            });
            if(testBlock(details.url)){
                return {cancel:true}
            }
        }
    },
    {urls: ["<all_urls>"]},
    ["requestHeaders", "blocking"]
);

// Get requestBody from POST requests
chrome.webRequest.onBeforeRequest.addListener(
    function(details) {
        if (details.method === "POST") {
            let body = null;

            // Check if requestBody.raw exists
            if (details.requestBody.raw) {
                // Convert raw bytes to a Base64 string
                body = btoa(String.fromCharCode(...new Uint8Array(details.requestBody.raw[0]['bytes'])));
            } else if (details.requestBody.formData) {
                // Preserve full formData structure without indexing
                body = {};
                for (let key in details.requestBody.formData) {
                    if (details.requestBody.formData.hasOwnProperty(key)) {
                        // Assign the whole array, not just the first element
                        body[key] = details.requestBody.formData[key];
                    }
                }
                body = JSON.stringify(body);
            } else if (details.requestBody.json) {
                // Preserve the full JSON structure without extracting individual elements
                body = details.requestBody.json; // Keep it as an object
                body = JSON.stringify(body); // Convert to string as it is
            }

            // Push the body and request ID to the bodys array
            window.bodys.push({
                body: body,
                id: details.requestId
            });
        }
    },
    {urls: ["<all_urls>"]},
    ["requestBody"]
);

//Receive PSSH from content.js
chrome.runtime.onMessage.addListener(
    function (request, sender, sendResponse) {
        switch(request.type){
            case "RESET":
                location.reload()
                break;
            case "PSSH":
                window.psshs.push(request.text)
                window.pageURL=sender.tab.url
                window.targetIds=[sender.tab.id, sender.frameId]
                break;
            case "CLEARKEY":
                window.clearkey=request.text
                break;
        }
    }
);
} )()

chrome.browserAction.onClicked.addListener(tab => {
    if(chrome.windows){
        chrome.windows.create({
            url: "popup.html",
            type: "popup",
            width: 820,
            height: 600
        });
    } else {
        chrome.tabs.create({url: 'popup.html'})
    }
});

function createMenu(){
    chrome.storage.local.set({'isBlock': false}, null);
    chrome.contextMenus.create({
        id: "toggleBlocking",
        title: "Enable License Blocking"
    });
}
chrome.runtime.onInstalled.addListener(createMenu)
chrome.runtime.onStartup.addListener(createMenu)

chrome.contextMenus.onClicked.addListener(item => {
    if(item.menuItemId == "toggleBlocking"){
        chrome.storage.local.get("isBlock", (value) => {
            if(value.isBlock){
                chrome.storage.local.set({'isBlock': false}, null);
                chrome.contextMenus.update("toggleBlocking",{title: "Enable License Blocking"})
            } else {
                chrome.storage.local.set({'isBlock': true}, null);
                chrome.contextMenus.update("toggleBlocking",{title: "Disable License Blocking"})
            }
        })
    }
})
