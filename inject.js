// Refactored conversion functions
const fromHexString = hexString => Uint8Array.from(hexString.match(/.{1,2}/g).map(byte => parseInt(byte, 16)));

const toHexString = bytes => bytes.reduce((str, byte) => str + byte.toString(16).padStart(2, '0'), '');

const b64ToHex = b64 => [...atob(b64)].map(c=> c.charCodeAt(0).toString(16).padStart(2,0)).join``

// initData to PSSH
function getPssh(buffer) {
    const bytes = fromHexString(toHexString(new Uint8Array(buffer)).match(/000000..70737368.*/)[0]);
    return window.btoa(String.fromCharCode(...bytes));
}

// Get Clearkey keys
function getClearkey(response) {
    let obj=JSON.parse((new TextDecoder("utf-8")).decode(response))
    obj = obj["keys"].map(o => [o["kid"], o["k"]]);
    obj = obj.map(o => o.map(a => a.replace(/-/g, '+').replace(/_/g, '/')+"=="))
    return obj.map(o => `${b64ToHex(o[0])}:${b64ToHex(o[1])}`).join("\n")

}

// Widevine PSSH extraction from init
const originalGenerateRequest = MediaKeySession.prototype.generateRequest;
MediaKeySession.prototype.generateRequest = function(initDataType, initData) {
    const result = originalGenerateRequest.call(this, initDataType, initData);
    //Get PSSH and pass into content.js
    try {
        console.log("[PSSH] " + getPssh(initData))
        document.dispatchEvent(new CustomEvent('pssh', {
            detail: getPssh(initData)
        }));
    } finally {
        return result;
    }
};

//Clearkey Support
const originalUpdate = MediaKeySession.prototype.update;
MediaKeySession.prototype.update = function(response) {
    const result = originalUpdate.call(this, response);
    try {
        console.log("[CLEARKEY] " + getClearkey(response));
        document.dispatchEvent(new CustomEvent('clearkey', {
            detail: getClearkey(response)
        }));
    } finally {
        return result;
    }
};
