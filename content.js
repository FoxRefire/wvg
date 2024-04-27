const script = document.createElement('script');
script.type = 'text/javascript';
script.defer = false;
script.async = false;
script.src = chrome.runtime.getURL("inject.js");
(document.head || document.documentElement).appendChild(script);

//Reset variables at every page load in background.js
chrome.runtime.sendMessage({type: "RESET"},null);

//Send PSSH into background.js
document.addEventListener('pssh', (e) => {
    console.log(e.detail);
        chrome.runtime.sendMessage({
            type: "PSSH",
            text: e.detail,
            pageURL: document.URL
        },null);
});

//Fetch from original origin
chrome.runtime.onMessage.addListener(
  function (request, sender, sendResponse) {
    if(request.type=="FETCH"){
        console.log("DEBUG:"+JSON.stringify(request))
        let res = fetch(request.u, {
            method: request.m,
            headers: request.h,
            body: request.b
        }).then((r)=>r.arrayBuffer()).then((r)=>{
            sendResponse(
                btoa(String.fromCharCode(...new Uint8Array(r)))
            );
        })
    }
    return true
  }
);
