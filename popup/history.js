let psshs=chrome.extension.getBackgroundPage().psshs;
function showHistory(){
    chrome.storage.local.get(null, (data => {
        let tree=jsonview.renderJSON(JSON.stringify(data), document.getElementById('histDisp'));
        jsonview.toggleNode(tree);
    }));
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

document.getElementById('saveHistory').addEventListener("click", saveHistory);
document.getElementById('clearHistory').addEventListener("click", clearHistory);
showHistory()
