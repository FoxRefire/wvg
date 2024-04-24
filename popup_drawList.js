function selectPssh(){
    document.getElementById('home').style.display='none';
    document.getElementById('selectPssh').style.display='block';
}

function selectRequest(){
    document.getElementById('home').style.display='none';
    document.getElementById('selectRequest').style.display='block';
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
            document.getElementById('home').style.display='block';
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
                    document.getElementById('home').style.display='block';
                });
                list.appendChild(li);
            }
        });
    });
}
