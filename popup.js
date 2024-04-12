import CommonWV from './schemes/CommonWV.js';

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

document.querySelectorAll('input[name="apiType"]').forEach(radio => {
    radio.addEventListener('change', handleRadioChange);
});
function handleRadioChange(event) {
    if (event.target.value=="public"){
        document.getElementById('guessr').disabled="true";
        document.getElementById('guessr').value="https://proposed-marketa-foxrefire.koyeb.app";
    } else if (event.target.value=="local"){
        document.getElementById('guessr').disabled="true";
        document.getElementById('guessr').value="http://127.0.0.1:18888";
    } else if (event.target.value=="custom"){
        document.getElementById('guessr').disabled="false";
        document.getElementById('guessr').value="";
    }
}

async function guess(){
    const result=await CommonWV(document.getElementById('guessr').value,
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
