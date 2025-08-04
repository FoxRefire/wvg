// Refactored conversion functions
const hexStrToU8 = hexString => Uint8Array.from(hexString.match(/.{1,2}/g).map(byte => parseInt(byte, 16)));

const u8ToHexStr = bytes => bytes.reduce((str, byte) => str + byte.toString(16).padStart(2, '0'), '');

const b64ToHexStr = b64 => [...atob(b64)].map(c=> c.charCodeAt(0).toString(16).padStart(2,0)).join``

// initData to PSSH
function getPssh(buffer) {
    const bytes = hexStrToU8(u8ToHexStr(new Uint8Array(buffer)).match(/000000..70737368.*/)[0]);
    return window.btoa(String.fromCharCode(...bytes));
}

// Get Clearkey keys
function getClearkey(response) {
    let obj=JSON.parse((new TextDecoder("utf-8")).decode(response))
    obj = obj["keys"].map(o => [o["kid"], o["k"]]);
    obj = obj.map(o => o.map(a => a.replace(/-/g, '+').replace(/_/g, '/')+"=="))
    return obj.map(o => `${b64ToHexStr(o[0])}:${b64ToHexStr(o[1])}`).join("\n")

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



function uint8ArrayToString(uint8array) {
    return String.fromCharCode.apply(null, uint8array)
}

class Evaluator {
    static isDASH(text) {
        return text.includes('<mpd') && text.includes('</mpd>');
    }

    static isHLS(text) {
        return text.includes('#extm3u');
    }

    static isHLSMaster(text) {
        return text.includes('#ext-x-stream-inf');
    }

    static isMSS(text) {
        return text.includes('<smoothstreamingmedia') && text.includes('</smoothstreamingmedia>');
    }

    static getManifestType(text) {
        const lower = text.toLowerCase();
        if (this.isDASH(lower)) {
            return "DASH";
        } else if (this.isHLS(lower)) {
            if (this.isHLSMaster(lower)) {
                return "HLS_MASTER";
            } else {
                return "HLS_PLAYLIST";
            }
        } else if (this.isMSS(lower)) {
            return "MSS";
        }
    }
}

const originalFetch = window.fetch;
window.fetch = function() {
    return new Promise(async (resolve, reject) => {
        originalFetch.apply(this, arguments).then((response) => {
            if (response) {
                response.clone().text().then((text) => {
                    const manifest_type = Evaluator.getManifestType(text);
                    if (manifest_type) {
                        if (arguments.length === 1) {
                            console.log('fetch1 manifest', arguments[0].url, manifest_type);
                            document.dispatchEvent(new CustomEvent('manifest', {
                                detail: JSON.stringify({
                                    "url": arguments[0].url,
                                    "type": manifest_type,
                                })
                            }));
                        } else if (arguments.length === 2) {
                            console.log('fetch2 manifest', arguments[0], manifest_type);
                            document.dispatchEvent(new CustomEvent('manifest', {
                                detail: JSON.stringify({
                                    "url": arguments[0],
                                    "type": manifest_type,
                                })
                            }));
                        }
                    }
                    resolve(response);
                }).catch(() => {
                    resolve(response);
                })
            } else {
                resolve(response);
            }
        }).catch(() => {
            resolve();
        })
    })
}

const open = XMLHttpRequest.prototype.open;
XMLHttpRequest.prototype.open = function(method, url) {
    this._method = method;
    return open.apply(this, arguments);
};

const send = XMLHttpRequest.prototype.send;
XMLHttpRequest.prototype.send = function(postData) {
    this.addEventListener('load', async function() {
        if (this._method === "GET") {
            let body = void 0;
            switch (this.responseType) {
                case "":
                case "text":
                    body = this.responseText ?? this.response;
                    break;
                case "json":
                    // TODO: untested
                    body = JSON.stringify(this.response);
                    break;
                case "arraybuffer":
                    // TODO: untested
                    if (this.response.byteLength) {
                        const response = new Uint8Array(this.response);
                        body = uint8ArrayToString(new Uint8Array([...response.slice(0, 2000), ...response.slice(-2000)]));
                    }
                    break;
                case "document":
                    // todo
                    break;
                case "blob":
                    body = await this.response.text();
                    break;
            }
            if (body) {
                const manifest_type = Evaluator.getManifestType(body);
                if (manifest_type) {
                    console.log('send manifest', this.responseURL, manifest_type);
                    document.dispatchEvent(new CustomEvent('manifest', {
                        detail: JSON.stringify({
                            "url": this.responseURL,
                            "type": manifest_type,
                        })
                    }));
                }
            }
        }
    });
    return send.apply(this, arguments);
};
