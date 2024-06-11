let psshs=chrome.extension.getBackgroundPage().psshs;
function showHistory(){
    chrome.storage.local.get(null, ((data) => {
        let tree=jsonview.renderJSON(JSON.stringify(data), document.getElementById('histDisp'));
        jsonview.toggleNode(tree);
    }));
    document.getElementById('home').style.display='none';
    document.getElementById('noEME').style.display='none';
    document.getElementById('history').style.display='grid';
    document.getElementById('toggleHistory').style.display='none';
    document.getElementById('selectPssh').style.display='none';
    document.getElementById('psshList').style.display='none';
    document.getElementById('selectRequest').style.display='none';
    document.getElementById('requestListList').style.display='none';

}

function backHistory(){
    document.getElementById('histDisp').innerHTML="";
    document.getElementById('history').style.display='none';
    document.getElementById('selectPssh').style.display='none';
    document.getElementById('psshList').style.display='none';
    document.getElementById('toggleHistory').style.display='grid';
    document.getElementById('selectRequest').style.display='none';
    document.getElementById('requestList').style.display='none';
    if(psshs.length != 0){
        document.getElementById('home').style.display='grid';
    } else {
        document.getElementById('noEME').style.display='grid';
    }
}

function saveHistory(){
    chrome.storage.local.get(null, ((data) => {
        let blob = new Blob([JSON.stringify(data, null, "\t")], {type: "text/plain"});
        let blobLink = URL.createObjectURL(blob);
        let a = document.createElement('a');
        a.download = 'wvgHistory.json';
        a.href = blobLink
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(blobLink);
    }));
}

function clearHistory(){
    if(confirm("Do you really want to clear history?")){
        chrome.storage.local.clear();
        document.getElementById('histDisp').innerHTML="";
    }
}
document.getElementById('historyButton').addEventListener("click", showHistory);
document.getElementById('backHistory').addEventListener("click", backHistory);
document.getElementById('saveHistory').addEventListener("click", saveHistory);
document.getElementById('clearHistory').addEventListener("click", clearHistory);
