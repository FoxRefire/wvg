let psshs=chrome.extension.getBackgroundPage().psshs;
function showHistory(){
    chrome.storage.local.get(null, ((data) => {
        let tree=jsonview.renderJSON(JSON.stringify(data), document.getElementById('histDisp'));
        jsonview.toggleNode(tree);
    }));
    document.getElementById('wvHome').style.display='none';
    document.getElementById('noEME').style.display='none';
    document.getElementById('history').style.display='flex';
}

function backHistory(){
    document.getElementById('histDisp').innerHTML="";
    document.getElementById('history').style.display='none';
    if(psshs.length){
        document.getElementById('wvHome').style.display='flex';
    } else {
        document.getElementById('noEME').style.display='none';
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
