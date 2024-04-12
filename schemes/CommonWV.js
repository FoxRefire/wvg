export default async function(serverAddr, pssh, licUrl,_headers) {
    console.group("fetch cert...");
    let certBuffer = await fetch(licUrl, {
        body: new Uint8Array([0x08, 0x04]),
        headers: _headers,
        method: "POST"
    }).then(resp => resp.arrayBuffer());
    let certB64 = btoa(String.fromCharCode(...new Uint8Array(certBuffer)));
    console.log(certB64);
    console.groupEnd();

    console.group("fetch challenge...");
    let jsonC = await fetch(serverAddr + "/getchallenge", {
        body: JSON.stringify({
            "PSSH": pssh,
            "CertBase64": certB64
        }),
        headers: {
            "Content-Type": "application/json"
        },
        method: "POST"
    }).then(resp => resp.json());
    let challengeBase64 = jsonC.challengeBase64;
    console.log(challengeBase64);
    console.groupEnd();

    console.group("fetch license...");
    let licBuffer = await fetch(licUrl, {
        body: Uint8Array.from(atob(challengeBase64), (c) => c.charCodeAt(0)),
        headers: _headers,
        method: "POST"
    }).then(resp => resp.arrayBuffer());
    let licB64 = btoa(String.fromCharCode(...new Uint8Array(licBuffer)));
    console.log(licB64);
    console.groupEnd();

    console.group("get keys...");
    let jsonK = await fetch(serverAddr + "/getkeys", {
        body: JSON.stringify({
            "PSSH": pssh,
            "ChallengeBase64": challengeBase64,
            "LicenseBase64": licB64
        }),
        headers: {
            "Content-Type": "application/json"
        },
        method: "POST"
    }).then(resp => resp.json());
    let keys = jsonK.keys;
    console.log(keys);
    console.groupEnd();
    return keys;
};
