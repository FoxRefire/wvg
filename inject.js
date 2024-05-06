// Refactored conversion functions
const fromHexString = hexString => Uint8Array.from(hexString.match(/.{1,2}/g).map(byte => parseInt(byte, 16)));

const toHexString = bytes => bytes.reduce((str, byte) => str + byte.toString(16).padStart(2, '0'), '');

// Refactored getPssh function
function getPssh(buffer) {
    const bytes = fromHexString(toHexString(new Uint8Array(buffer)).match(/000000..70737368.*/)[0]);
    return window.btoa(String.fromCharCode(...bytes));
}

// Refactored MediaKeySession.prototype.generateRequest
const originalGenerateRequest = MediaKeySession.prototype.generateRequest;

MediaKeySession.prototype.generateRequest = function(initDataType, initData) {
    const result = originalGenerateRequest.call(this, initDataType, initData);
    //Get PSSH and pass into content.js
    try {
        document.dispatchEvent(new CustomEvent('pssh', {
            detail: getPssh(initData)
        }));
    } finally {
        return result;
    }
};
