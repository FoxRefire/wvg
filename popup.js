import CommonWV from './schemes/CommonWV.js';
import DRMToday from './schemes/DRMToday.js';

let psshs=chrome.extension.getBackgroundPage().getPsshs();
let requests=chrome.extension.getBackgroundPage().getRequests();

function selectPssh(){
    document.getElementById('home').style.display='none';
    document.getElementById('selectPssh').style.display='block';
}

function selectRequest(){
    document.getElementById('home').style.display='none';
    document.getElementById('selectRequest').style.display='block';
}

async function guess(){
    let WVScheme;
    switch (document.getElementById('scheme').value) {
        case "CommonWV":
            WVScheme=CommonWV;
            break;
        case "DRMToday":
            WVScheme=DRMToday;
            break;
    }
    const result=await WVScheme(document.getElementById('guessr').value,
                                document.getElementById('pssh').value,
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
        if(psshs.length==1){
            document.getElementById('pssh').value=psshs[0];
        }
    });
}
