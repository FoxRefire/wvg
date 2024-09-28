function selectPssh(){
    document.getElementById('wvHome').style.display='none';
    document.getElementById('selectPssh').style.display='flex';
}

function selectRequest(){
    document.getElementById('wvHome').style.display='none';
    document.getElementById('selectRequest').style.display='flex';
}

document.getElementById('psshButton').addEventListener("click", selectPssh);
document.getElementById('licenseButton').addEventListener("click", selectRequest);

function writeListElement(arrElements, list, outputVar, search) {
    list.innerHTML = '';
    arrElements.forEach((element, index) => {
        // Check if search is defined and if the element includes the search value
        if (!search || element.toLowerCase().includes(search)) {
            const li = document.createElement('li');
            li.textContent = element;
            li.addEventListener('click', () => {
                userInputs[outputVar] = index;
                document.getElementById(outputVar).value = element;
                document.getElementById(outputVar + 'Index').value = index;
                document.getElementById('selectPssh').style.display = 'none';
                document.getElementById('selectRequest').style.display = 'none';
                document.getElementById('wvHome').style.display = 'flex';
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
