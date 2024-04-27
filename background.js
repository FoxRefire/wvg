let psshs=[];
let requests=[];
let bodys=[];
let pageURL="";
function convertHeaders(obj){
    return JSON.stringify(Object.fromEntries(obj.map(header => [header.name, header.value])))
}

//Get URL and headers from POST requests
chrome.webRequest.onBeforeSendHeaders.addListener(
 function(details) {
    if (details.method === "POST") {
      requests.push({
          url:details.url,
          headers:convertHeaders(details.requestHeaders),
          body:bodys.find((b) => b.id == details.requestId).body
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
      bodys.push({
          body:btoa(String.fromCharCode(...new Uint8Array(details.requestBody.raw[0]['bytes']))),
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
            psshs=[];
            requests=[];
            bodys=[];
            break;
        case "PSSH":
            psshs.push(request.text)
            pageURL=request.pageURL
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

window.getPsshs = () => {
  return psshs;
};

window.getRequests = () => {
  return requests;
};

window.getPageURL = () => {
  return pageURL;
};
