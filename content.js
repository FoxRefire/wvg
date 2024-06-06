const script = document.createElement('script');
script.type = 'text/javascript';
script.defer = false;
script.async = false;
script.src = chrome.runtime.getURL("inject.js");
(document.head || document.documentElement).appendChild(script);

//Reset variables at every page load in background.js
if (window === window.parent){
    chrome.runtime.sendMessage({type: "RESET"},null);
    setTimeout( ()=>{
        chrome.runtime.sendMessage({
            type: "URL",
            text: document.URL
        },null);
    }, 700);
}

//Send PSSH into background.js
document.addEventListener('pssh', (e) => {
        chrome.runtime.sendMessage({
            type: "PSSH",
            text: e.detail
        },null);
});

//Send Clearkey into background.js
document.addEventListener('clearkey', (e) => {
        chrome.runtime.sendMessage({
            type: "CLEARKEY",
            text: e.detail
        },null);
});

//Fetch from original origin
chrome.runtime.onMessage.addListener(
  function (request, sender, sendResponse) {
    if(request.type=="FETCH"){
        let res = fetch(request.u, {
            method: request.m,
            headers: JSON.parse(request.h),
            body: Uint8Array.from(atob(request.b), c => c.charCodeAt(0))
        }).then((r)=>r.arrayBuffer()).then((r)=>{
            sendResponse(
                btoa(String.fromCharCode(...new Uint8Array(r)))
            );
        })
    }
    return true
  }
);
