let psshs=chrome.extension.getBackgroundPage().getPsshs();
let requests=chrome.extension.getBackgroundPage().getRequests();
let userInputs={};

function drawList(arr,_searchBox,_list,_userInputs){
    const elements = arr;
    const searchBox = document.getElementById(_searchBox);
    const list = document.getElementById(_list);

    elements.forEach((element, index) => {
        const li = document.createElement('li');
        li.textContent = element;
        li.addEventListener('click', () => {
            userInputs[_userInputs]=index;
            document.getElementById(_userInputs).value=element;
            document.getElementById(_userInputs+'Index').value=index;
            document.getElementById('selectPssh').style.display='none';
            document.getElementById('selectRequest').style.display='none';
            document.getElementById('home').style.display='block';
        });
        list.appendChild(li);
    });

    searchBox.addEventListener('input', (event) => {
        const searchValue = event.target.value.toLowerCase();
        list.innerHTML = '';
        elements.forEach((element, index) => {
            if (element.toLowerCase().includes(searchValue)) {
                const li = document.createElement('li');
                li.textContent = element;
                li.addEventListener('click', () => {
                    userInputs[_userInputs]=index;
                    document.getElementById(_userInputs).value=element;
                    document.getElementById(_userInputs+'Index').value=index;
                    document.getElementById('selectPssh').style.display='none';
                    document.getElementById('selectRequest').style.display='none';
                    document.getElementById('home').style.display='block';
                });
                list.appendChild(li);
            }
        });
    });
}

function selectPssh(){
    document.getElementById('home').style.display='none';
    document.getElementById('selectPssh').style.display='block';
}

function selectRequest(){
    document.getElementById('home').style.display='none';
    document.getElementById('selectRequest').style.display='block';
}

var CommonWV = async function(pssh, licUrl,_headers) {
    const serverAddr = "http://127.0.0.1:18888";
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

async function guess(){
    endpoint = document.getElementById('guessr').value;
    // payload = {
    //     "PSSH": psshs[userInputs['pssh']],
    //     "Headers": requests[userInputs['license']]['headers'],
    //     "LicenseUrl": requests[userInputs['license']]['url']
    // }
    // console.log(JSON.stringify(payload));
    // console.log(endpoint);
    //
    // let json = await fetch(endpoint, {
    //     body: JSON.stringify(payload),
    //     headers: {"Content-Type": "application/json"},
    //     method: "POST"
    // }).then(resp => resp.json());

    const result=await CommonWV(psshs[userInputs['pssh']],
                                requests[userInputs['license']]['url'],
                                requests[userInputs['license']]['headers'])
    document.getElementById('result').value=result;
}

if(psshs.length!=0){
    document.addEventListener('DOMContentLoaded', function() {
        document.getElementById('noEME').style.display='none';
        document.getElementById('home').style.display='block';
        document.getElementById('psshButton').addEventListener("click", selectPssh);
        document.getElementById('licenseButton').addEventListener("click", selectRequest);
        document.getElementById('guess').addEventListener("click", guess);
        drawList(psshs,'psshSearch','psshList','pssh');
        drawList(requests.map(r => r['url']),'requestSearch','requestList','license');
    });
}

//setInterval(()=>console.log(requests[userInputs['license']]),1500);
