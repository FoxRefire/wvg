window.psshs=[];
window.requests=[];
window.bodys=[];
window.pageURL="";
window.clearkey="";

chrome.storage.local.get("isBlock", (value) => {
    if(value.isBlock == true){
        window.isBlock=true;
    } else {
        window.isBlock=false;
    }
    console.log("Debug:"+value.isBlock)
})

function convertHeaders(obj){
    return JSON.stringify(Object.fromEntries(obj.map(header => [header.name, header.value])))
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
            if(details.url.includes("license.vdocipher.com") && window.isBlock==true){
                return {cancel:true}
            } else {
                return details
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

chrome.browserAction.onClicked.addListener(function(tab) {
    chrome.windows.create({
        url: "popup.html",
        type: "popup",
        width: 820,
        height: 600
    });
});

chrome.runtime.onInstalled.addListener(() => {
    let toggleBlocking = chrome.contextMenus.create({
        id: "toggleBlocking",
        title: "Disable License Blocking"
    });
})

chrome.contextMenus.onClicked.addListener(item => {
    if(item.menuItemId == "toggleBlocking"){
        chrome.storage.local.get("isBlock", (value) => {
            if(value.isBlock == true){
                chrome.storage.local.set({'isBlock': false}, ()=>{});
                chrome.contextMenus.update("toggleBlocking",{title: "Enable License Blocking"})
            } else {
                chrome.storage.local.set({'isBlock': true}, ()=>{});
                chrome.contextMenus.update("toggleBlocking",{title: "Disable License Blocking"})
            }
        })
    }
})
