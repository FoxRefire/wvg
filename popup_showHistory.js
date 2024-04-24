function showHistory(){
    chrome.storage.local.get(null, ((data) => {
        let tree=jsonview.renderJSON(JSON.stringify(data), document.getElementById('histDisp'));
        jsonview.toggleNode(tree);
    }));
    document.getElementById('home').style.display='none';
    document.getElementById('history').style.display='block';
}

function backHistory(){
    document.getElementById('histDisp').innerHTML="";
    document.getElementById('history').style.display='none';
    document.getElementById('home').style.display='block';
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
