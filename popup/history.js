function showHistory() {
  chrome.storage.local.get(null, (data) => {
    const tree = jsonview.renderJSON(JSON.stringify(data), document.getElementById("histDisp"));
    jsonview.toggleNode(tree);
  });
}

function saveHistory() {
  chrome.storage.local.get(null, (data) => {
    const blob = new Blob([JSON.stringify(data, null, "\t")], { type: "text/plain" });
    const link = document.createElement("a");
    link.download = "wvgHistory.json";
    link.href = URL.createObjectURL(blob);
    link.click();
  });
}

function clearHistory() {
  if (confirm("Do you really want to clear history?")) {
    chrome.storage.local.clear(() => {
      document.getElementById("histDisp").innerHTML = "";
    });
  }
}

document.getElementById("saveHistory").addEventListener("click", saveHistory);
document.getElementById("clearHistory").addEventListener("click", clearHistory);
showHistory();
