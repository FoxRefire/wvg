import { SettingsManager } from "./settingManager.js";

let psshs=chrome.extension.getBackgroundPage().psshs;
let requests=chrome.extension.getBackgroundPage().requests;
let pageURL=chrome.extension.getBackgroundPage().pageURL;
let title=chrome.extension.getBackgroundPage().title;
let targetIds=chrome.extension.getBackgroundPage().targetIds;
let clearkey=chrome.extension.getBackgroundPage().clearkey;
let manifests = chrome.extension.getBackgroundPage().manifests;

async function createCommand() {
    const header_string = Object.entries(JSON.parse(requests[userInputs['license']]['headers'])).filter(([key, value]) => key != 'Host').map(([key, value]) => `-H "${key}: ${value.replace(/"/g, "'")}"`).join(' ');
    return `N_m3u8DL-RE "${manifest_list.value}" ${header_string} ${document.getElementById('result').value.split('\n').filter(key => key != '').map(key => `--key ${key}`).join(' ')} ${await SettingsManager.getUseShakaPackager() ? "--use-shaka-packager " : ""}-M format=mkv${await SettingsManager.getSetFilenameFromTitle() && title ? " --save-name ".concat('"', title, '"') : ""}${await SettingsManager.getUseSelectVideo() ? " --select-video ".concat(await SettingsManager.getSelectVideoParam()) : ""}${await SettingsManager.getUseSelectAudio() ? " --select-audio ".concat(await SettingsManager.getSelectAudioParam()) : ""}`;
}

async function guess(){
    //Be patient!
    document.body.style.cursor = "wait";
    document.getElementById("guess").disabled=true

    //Init Pyodide
    let pyodide = await loadPyodide();
    await pyodide.loadPackage(["certifi-2024.2.2-py3-none-any.whl","charset_normalizer-3.3.2-py3-none-any.whl","construct-2.8.8-py2.py3-none-any.whl","idna-3.6-py3-none-any.whl","packaging-23.2-py3-none-any.whl","protobuf-4.24.4-cp312-cp312-emscripten_3_1_52_wasm32.whl","pycryptodome-3.20.0-cp35-abi3-emscripten_3_1_52_wasm32.whl","pymp4-1.4.0-py3-none-any.whl","pyodide_http-0.2.1-py3-none-any.whl","pywidevine-1.8.0-py3-none-any.whl","requests-2.31.0-py3-none-any.whl","urllib3-2.2.1-py3-none-any.whl"].map(e=>"/libs/wheels/"+e))

    //Configure Guesser
    pyodide.globals.set("pssh", document.getElementById('pssh').value);
    pyodide.globals.set("licUrl", requests[userInputs['license']]['url']);
    pyodide.globals.set("licHeaders", requests[userInputs['license']]['headers']);
    pyodide.globals.set("licBody", requests[userInputs['license']]['body']);
    let pre = await fetch('/python/pre.py').then(res=>res.text())
    let after = await fetch('/python/after.py').then(res=>res.text())
    let scheme = document.getElementById("schemeCode").value

    //Get result
    let result = await pyodide.runPythonAsync([pre, scheme, after].join("\n"));
    document.getElementById('result').value=result;

    //Save history
    let historyData={
        PSSH: document.getElementById('pssh').value,
        KEYS: result.split("\n").slice(0,-1)
    }
    chrome.storage.local.set({[pageURL]: historyData}, null);

    //All Done!
    document.body.style.cursor = "auto";
    document.getElementById("guess").disabled = false
    command.value = await createCommand();
    command.disabled = false;
}

function copyResult(){
    this.select();
    navigator.clipboard.writeText(this.value);
}

window.corsFetch = (u, m, h, b) => {
    return new Promise((resolve, reject) => {
        chrome.tabs.sendMessage(targetIds[0], {type:"FETCH", u:u, m:m, h:h, b:b}, {frameId:targetIds[1]}, res => {
            resolve(res)
        })
    })
}

async function autoSelect(){
    userInputs["license"]=0;
    document.getElementById("license").value=requests[0]['url'];
    document.getElementById('pssh').value=psshs[0];
    document.getElementById('title').value = title;
    
    let selectRules = await fetch("/selectRules.conf").then((r)=>r.text());
    //Remove blank lines, comment-outs, and trailing spaces at the end of lines
    selectRules = selectRules.replace(/\n^\s*$|\s*\/\/.*|\s*$/gm, "");
    selectRules = selectRules.split("\n").map(row => row.split("$$"));
    for(var item of selectRules){
        let search = requests.map(r => r['url']).findIndex(e => e.includes(item[0]));
        if(search>=0){
            if(item[1]) document.getElementById("schemeSelect").value = item[1];
            userInputs["license"]=search;
            document.getElementById("license").value=requests[search]['url'];
            break;
        }
    }

    document.getElementById("schemeSelect").dispatchEvent(new Event("input"))
}

if (clearkey) {
    document.getElementById('noEME').style.display = 'none';
    document.getElementById('ckHome').style.display = 'grid';
    document.getElementById('ckResult').value = clearkey;
    document.getElementById('ckResult').addEventListener("click", copyResult);
} else if (psshs.length) {
    document.getElementById('noEME').style.display = 'none';
    document.getElementById('home').style.display = 'grid';
    document.getElementById('guess').addEventListener("click", guess);
    document.getElementById('result').addEventListener("click", copyResult);
    document.getElementById('command').addEventListener("click", copyResult);
    autoSelect();
}

document.addEventListener('DOMContentLoaded', async function () {
    use_shaka.checked = await SettingsManager.getUseShakaPackager();
    set_filename_from_title.checked = await SettingsManager.getSetFilenameFromTitle();
    use_select_video.checked = await SettingsManager.getUseSelectVideo();
    select_video_param.value = await SettingsManager.getSelectVideoParam();
    use_select_audio.checked = await SettingsManager.getUseSelectAudio();
    select_audio_param.value = await SettingsManager.getSelectAudioParam();
});

const use_shaka = document.getElementById('use-shaka');
use_shaka.addEventListener('change', async function (){
    await SettingsManager.saveUseShakaPackager(use_shaka.checked);
});

const set_filename_from_title = document.getElementById('set-filename-from-title');
set_filename_from_title.addEventListener('change', async function () {
    await SettingsManager.saveSetFilenameFromTitle(set_filename_from_title.checked);
});

const use_select_video = document.getElementById('use-select-video');
use_select_video.addEventListener('change', async function (){
    await SettingsManager.saveUseSelectVideo(use_select_video.checked);
});

const select_video_param = document.getElementById('select-video-param');
select_video_param.addEventListener('input', async function (event) {
    await SettingsManager.saveSelectVideoParam(select_video_param.value);
});

const use_select_audio = document.getElementById('use-select-audio');
use_select_audio.addEventListener('change', async function () {
    await SettingsManager.saveUseSelectAudio(use_select_audio.checked);
});

const select_audio_param = document.getElementById('select-audio-param');
select_audio_param.addEventListener('input', async function (event) {
    await SettingsManager.saveSelectAudioParam(select_audio_param.value);
});

const command = document.getElementById('command');
command.disabled = true;
const manifest_list = document.getElementById('manifest');
manifest_list.addEventListener('change', async () => {
    command.value = await createCommand();
});
manifests.forEach(element => {
    const option = new Option(`[${element.type}] ${element.url}`, element.url, element.type.startsWith('DASH'), element.type.startsWith('DASH'));
    manifest_list.add(option);
});

