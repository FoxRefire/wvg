let psshs=[];
let requests=[];
let pageURL="";
function convertHeaders(obj){
    return JSON.stringify(Object.fromEntries(obj.map(header => [header.name, header.value])))
}
chrome.webRequest.onBeforeSendHeaders.addListener(
 function(details) {
    if (details.method === "POST") {
      requests.push({
          url:details.url,
          headers:convertHeaders(details.requestHeaders)
      });
    }
 },
 {urls: ["<all_urls>"]},
 ["requestHeaders"]
);

//Receive PSSH from content.js
chrome.runtime.onMessage.addListener(
  function (request, sender, sendResponse) {
    switch(request.type){
        case "RESET":
            psshs=[];
            requests=[];
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
