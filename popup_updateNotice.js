document.addEventListener('DOMContentLoaded', async function() {
    cManifest=await fetch("manifest.json").then(r=>r.json());
    rManifest=await fetch("https://raw.githubusercontent.com/FoxRefire/wvg/next/manifest.json").then(r=>r.json());
    if(cManifest.version < rManifest.version){
        let notice = document.getElementById("updateNoticeExtension");
        notice.style.display='flex';
        notice.innerHTML = notice.innerHTML.replace("=VER=", rManifest.version);
        notice.innerHTML = notice.innerHTML.replace("=HASH=", rManifest.version_name);
    }
});
