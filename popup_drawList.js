function selectPssh(){
    document.getElementById('home').style.display='none';
    document.getElementById('selectPssh').style.display='grid';
    document.getElementById('psshList').style.display='grid';
    document.getElementById('toggleHistory').style.display='none';
    document.getElementById('bodyid').style.gridTemplateRows='auto 1fr auto';
}

function selectRequest(){
    document.getElementById('home').style.display='none';
    document.getElementById('selectRequest').style.display='grid';
    document.getElementById('requestList').style.display='grid';
    document.getElementById('toggleHistory').style.display='none';
    document.getElementById('bodyid').style.gridTemplateRows='auto 1fr auto';
}

document.getElementById('psshButton').addEventListener("click", selectPssh);
document.getElementById('licenseButton').addEventListener("click", selectRequest);

var userInputs={};
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
            document.getElementById('home').style.display='grid';
            document.getElementById('toggleHistory').style.display='grid';
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
                    document.getElementById('home').style.display='grid';
                });
                list.appendChild(li);
            }
        });
    });
}
