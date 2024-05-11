window.psshs=[];
window.requests=[];
window.bodys=[];
window.pageURL="";
window.clearkey="";
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
    }
 },
 {urls: ["<all_urls>"]},
 ["requestHeaders"]
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
        case "PSSH":
            window.psshs.push(request.text)
            window.pageURL=request.pageURL
            break;
        case "CLEARKEY":
            window.clearkey=request.text
            window.pageURL=request.pageURL
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
