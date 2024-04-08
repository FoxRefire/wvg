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
            text: e.detail
        },null);
});
