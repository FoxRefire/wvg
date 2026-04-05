window.psshs = [];
window.requests = [];
window.pageURL = "";
window.targetIds = [];
window.clearkey = "";

async function initData() {
    return new Promise((resolve) => {
        chrome.runtime.sendMessage({ type: "GET_DATA" }, (response) => {
            if (response) {
                window.psshs = response.psshs || [];
                window.requests = response.requests || [];
                window.pageURL = response.pageURL || "";
                window.targetIds = response.targetIds || [];
                window.clearkey = response.clearkey || "";
            }
            resolve();
        });
    });
}

async function guess() {
    // Be patient!
    document.body.style.cursor = "wait";
    document.getElementById("guess").disabled = true;

    try {
        // Init Pyodide
        let pyodide = await loadPyodide();
        await pyodide.loadPackage(["certifi-2024.2.2-py3-none-any.whl", "charset_normalizer-3.3.2-py3-none-any.whl", "construct-2.8.8-py2.py3-none-any.whl", "idna-3.6-py3-none-any.whl", "packaging-23.2-py3-none-any.whl", "protobuf-4.24.4-cp312-cp312-emscripten_3_1_52_wasm32.whl", "pycryptodome-3.20.0-cp35-abi3-emscripten_3_1_52_wasm32.whl", "pymp4-1.4.0-py3-none-any.whl", "pyodide_http-0.2.1-py3-none-any.whl", "pywidevine-1.8.0-py3-none-any.whl", "requests-2.31.0-py3-none-any.whl", "urllib3-2.2.1-py3-none-any.whl"].map(e => "/libs/wheels/" + e));

        // Configure Guesser
        const schemeSelect = document.getElementById('schemeSelect');
        const schemeName = schemeSelect.options[schemeSelect.selectedIndex].text;
        pyodide.globals.set("pssh", document.getElementById('pssh').value);
        pyodide.globals.set("licUrl", window.requests[userInputs['license']]['url']);
        pyodide.globals.set("licHeaders", window.requests[userInputs['license']]['headers']);
        pyodide.globals.set("licBody", window.requests[userInputs['license']]['body']);
        pyodide.globals.set("schemeName", schemeName);
        let pre = await fetch('/python/pre.py').then(res => res.text());
        let after = await fetch('/python/after.py').then(res => res.text());
        let scheme = document.getElementById("schemeCode").value;

        // Get result
        let result = await pyodide.runPythonAsync([pre, scheme, after].join("\n"));
        document.getElementById('result').value = result.trim();

        // Save history
        let historyData = {
            PSSH: document.getElementById('pssh').value,
            KEYS: result.split("\n").slice(0, -1)
        };
        chrome.storage.local.set({ [window.pageURL]: historyData });

    } catch (e) {
        console.error(e);
        const schemeSelect = document.getElementById('schemeSelect');
        const schemeName = schemeSelect.options[schemeSelect.selectedIndex].text;
        const resultField = document.getElementById('result');
        if (!resultField.value || resultField.value.includes("Decoding Error") || !resultField.value.includes(schemeName) || resultField.value === "Decryption results will appear here...") {
            resultField.value = `[${schemeName}] Doesn't fit, choose another challenge scheme!\n\nPython Error:\n${e.message}`;
        }
    } finally {
        // All Done!
        document.body.style.cursor = "auto";
        document.getElementById("guess").disabled = false;
    }
}

function copyResult() {
    let targetId = 'result';
    if (this.id === 'copyPsshBtn') targetId = 'pssh';
    else if (this.id === 'copyLicenseBtn') targetId = 'license';
    
    const target = document.getElementById(targetId);
    if (!target) return;
    
    // For disabled/read-only inputs, we need a special way to select/copy
    const text = target.value;
    navigator.clipboard.writeText(text);
}

window.corsFetch = (u, m, h, b) => {
    return new Promise((resolve, reject) => {
        chrome.tabs.sendMessage(window.targetIds[0], { type: "FETCH", u: u, m: m, h: h, b: b }, { frameId: window.targetIds[1] }, res => {
            resolve(res);
        });
    });
};

async function autoSelect() {
    if (!window.requests || !window.requests.length) return;
    userInputs["license"] = 0;
    document.getElementById("license").value = window.requests[0]['url'];
    document.getElementById('pssh').value = window.psshs[0] || "";

    let selectRulesContent = await fetch("/selectRules.conf").then((r) => r.text());
    // Remove blank lines, comment-outs, and trailing spaces at the end of lines
    let selectRules = selectRulesContent.replace(/\n^\s*$|\s*\/\/.*|\s*$/gm, "");
    selectRules = selectRules.split("\n").map(row => row.split("$$"));
    for (var item of selectRules) {
        let search = window.requests.map(r => r['url']).findIndex(e => e.includes(item[0]));
        if (search >= 0) {
            if (item[1]) document.getElementById("schemeSelect").value = item[1];
            userInputs["license"] = search;
            document.getElementById("license").value = window.requests[search]['url'];
            break;
        }
    }

    document.getElementById("schemeSelect").dispatchEvent(new Event("input"));
}

async function run() {
    await initData();
    if (window.clearkey) {
        document.getElementById('noEME').style.display = 'none';
        document.getElementById('ckHome').style.display = 'grid';
        document.getElementById('ckResult').value = window.clearkey;
        document.getElementById('ckResult').addEventListener("click", copyResult);
    } else if (window.psshs && window.psshs.length) {
        document.getElementById('noEME').style.display = 'none';
        document.getElementById('home').style.display = 'grid';
        document.getElementById('guess').addEventListener("click", guess);
        document.getElementById('copyResultBtn').addEventListener("click", copyResult);
        document.getElementById('copyPsshBtn').addEventListener("click", copyResult);
        document.getElementById('copyLicenseBtn').addEventListener("click", copyResult);
        autoSelect();
    }
}


run();

