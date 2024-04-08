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

async function guess(){
    endpoint = document.getElementById('guessr').value;
    payload = {
        "PSSH": psshs[userInputs['pssh']],
        "Headers": requests[userInputs['license']]['headers'],
        "LicenseUrl": requests[userInputs['license']]['url']
    }
    console.log(JSON.stringify(payload));
    console.log(endpoint);

    let json = await fetch(endpoint, {
        body: JSON.stringify(payload),
        headers: {"Content-Type": "application/json"},
        method: "POST"
    }).then(resp => resp.json());
    document.getElementById('result').value=JSON.stringify(json.keys, null , "\t");
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
