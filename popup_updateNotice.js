document.addEventListener('DOMContentLoaded', async function() {
    cManifest=JSON.parse(
        (await fetch("manifest.json").then(r=>r.text()))
    );
    rManifest=JSON.parse(
        (await fetch("https://raw.githubusercontent.com/FoxRefire/wvg/next/manifest.json").then(r=>r.text()))
    );
    if(cManifest.version < rManifest.version){
        let notice = document.getElementById("updateNotice");
        notice.style.display='block';
        notice.innerHTML = notice.innerHTML.replace("=VER=", rManifest.version);
        notice.innerHTML = notice.innerHTML.replace("=HASH=", rManifest.version_name);
    }
});
