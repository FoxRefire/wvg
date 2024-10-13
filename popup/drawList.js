function selectPssh(){
    document.getElementById('home').style.display='none';
    document.getElementById('selectPssh').style.display='grid';
    document.getElementById('psshList').style.display='grid';
    document.getElementById('toggleHistory').style.display='none';
}

function selectRequest(){
    document.getElementById('home').style.display='none';
    document.getElementById('selectRequest').style.display='grid';
    document.getElementById('requestList').style.display='grid';
    document.getElementById('toggleHistory').style.display='none';
}

document.getElementById('psshButton').addEventListener("click", selectPssh);
document.getElementById('licenseButton').addEventListener("click", selectRequest);

function writeListElement(arrElements, list, outputVar, search) {
    list.innerHTML = '';
    arrElements.forEach((element, index) => {
        if (!search || element.includes(searchValue)) {
            const li = document.createElement('li');
            li.textContent = element;
            li.addEventListener('click', () => {
                userInputs[outputVar]=index;
                document.getElementById(outputVar).value=element;
                document.getElementById('selectPssh').style.display='none';
                document.getElementById('selectRequest').style.display='none';
                document.getElementById('home').style.display='grid';
                document.getElementById('toggleHistory').style.display='grid';
            });
            list.appendChild(li);
        }
    });
}

var userInputs={};
function drawList(arrElements,searchBoxElmId,listElmId,outputVar) {
    const searchBox = document.getElementById(searchBoxElmId);
    const list = document.getElementById(listElmId);

    writeListElement(arrElements, list, outputVar, null)

    searchBox.addEventListener('input', (event) => {
        const searchValue = event.target.value.toLowerCase();
        writeListElement(arrElements, list, outputVar, searchValue)
    });
}
