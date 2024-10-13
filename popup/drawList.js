let psshs=chrome.extension.getBackgroundPage().psshs;
let requests=chrome.extension.getBackgroundPage().requests;
var userInputs={};

document.getElementById('psshButton').addEventListener("click", () => drawList(psshs, 'pssh'));
document.getElementById('licenseButton').addEventListener("click", () => drawList(requests.map(r => r['url']), 'license'));

function writeListElement(items, outputVar, searchStr) {
    document.getElementById("items").innerHTML = '';

    items.forEach((item, index) => {
        if (!searchStr || item.includes(searchStr)) {
            const li = document.createElement('li');
            li.textContent = item;
            li.addEventListener('click', () => itemSelected(index, item, outputVar));
            document.getElementById("items").appendChild(li);
        }
    });
}

function drawList(items, outputVar) {
    document.getElementById('home').style.display='none';
    document.getElementById('chooserContainer').style.display='grid';
    document.getElementById('toggleHistory').style.display='none';

    writeListElement(items, outputVar, null)
    document.getElementById("chooserSearch").addEventListener('input', event => {
        const searchStr = event.target.value.toLowerCase();
        writeListElement(items, outputVar, searchStr)
    });
}

function itemSelected(index, item, outputVar){
    userInputs[outputVar]=index;
    document.getElementById(outputVar).value=item;
    document.getElementById('chooserContainer').style.display='none';
    document.getElementById('home').style.display='grid';
    document.getElementById('toggleHistory').style.display='grid';
    document.getElementById("chooserSearch").value=""
}
