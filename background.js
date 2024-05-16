(async () => {
window.psshs=[];
window.requests=[];
window.bodys=[];
window.pageURL="";
window.clearkey="";

chrome.storage.local.get("isBlock", (value) => {
    window.isBlock = value.isBlock ? true : false;
})

function convertHeaders(obj){
    return JSON.stringify(Object.fromEntries(obj.map(header => [header.name, header.value])))
}

window.blockRules = await fetch("blockRules.conf").then((r)=>r.text());
blockRules = blockRules.replace(/\n^\s*$|\s*\/\/.*|\s*$/gm, "");
blockRules = blockRules.split("\n");
function testBlock(url) {
    if(window.isBlock){
        return blockRules.map(e => url.includes(e)).some(e=>e)
    } else {
        return false
    }
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

//Get requestBody from POST requests
chrome.webRequest.onBeforeRequest.addListener(
 function(details) {
    if (details.method === "POST") {
      window.bodys.push({
          body:details.requestBody.raw ? btoa(String.fromCharCode(...new Uint8Array(details.requestBody.raw[0]['bytes']))) : "",
          id:details.requestId
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
        case "URL":
            window.pageURL=request.text
            break;
        case "PSSH":
            window.psshs.push(request.text)
            break;
        case "CLEARKEY":
            window.clearkey=request.text
            break;
    }
  }
);
} )()

chrome.browserAction.onClicked.addListener(function(tab) {
    chrome.windows.create({
        url: "popup.html",
        type: "popup",
        width: 820,
        height: 600
    });
});

chrome.runtime.onInstalled.addListener(() => {
    chrome.storage.local.set({'isBlock': false}, null);
    let toggleBlocking = chrome.contextMenus.create({
        id: "toggleBlocking",
        title: "Enable License Blocking"
    });
})

chrome.contextMenus.onClicked.addListener(item => {
    if(item.menuItemId == "toggleBlocking"){
        chrome.storage.local.get("isBlock", (value) => {
            if(value.isBlock == true){
                chrome.storage.local.set({'isBlock': false}, null);
                chrome.contextMenus.update("toggleBlocking",{title: "Enable License Blocking"})
            } else {
                chrome.storage.local.set({'isBlock': true}, null);
                chrome.contextMenus.update("toggleBlocking",{title: "Disable License Blocking"})
            }
        })
    }
})
