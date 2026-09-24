// Manual selection of a PSSH or of a license request.
// The data lives on window.wvg, which popup/main.js fills in.

function itemSelected(index, item, outputVar) {
  window.wvg.userInputs[outputVar] = index;
  document.getElementById(outputVar).value = item;
  document.getElementById("chooserContainer").style.display = "none";
  document.getElementById("home").style.display = "grid";
  document.getElementById("toggleHistory").style.display = "grid";
  document.getElementById("chooserSearch").value = "";
}

function writeListElement(items, outputVar, searchStr) {
  const list = document.getElementById("items");
  list.innerHTML = "";

  items.forEach((item, index) => {
    if (searchStr && !item.toLowerCase().includes(searchStr)) return;
    const entry = document.createElement("li");
    entry.textContent = item;
    entry.addEventListener("click", () => itemSelected(index, item, outputVar));
    list.appendChild(entry);
  });
}

function drawList(items, outputVar) {
  document.getElementById("home").style.display = "none";
  document.getElementById("chooserContainer").style.display = "grid";
  document.getElementById("toggleHistory").style.display = "none";

  writeListElement(items, outputVar, "");
  document.getElementById("chooserSearch").oninput = (event) => {
    writeListElement(items, outputVar, event.target.value.toLowerCase());
  };
}

document.getElementById("psshButton").addEventListener("click", () => drawList(window.wvg.psshs, "pssh"));
document
  .getElementById("licenseButton")
  .addEventListener("click", () => drawList(window.wvg.requests.map((request) => request.url), "license"));
