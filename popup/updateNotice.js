const UPDATE_CHECK_URL = "https://raw.githubusercontent.com/FoxRefire/wvg/next/manifest.json";

function versionParts(version) {
  return String(version)
    .split(/[^0-9]+/)
    .filter(Boolean)
    .map(Number);
}

function isNewer(candidate, current) {
  const latest = versionParts(candidate);
  const installed = versionParts(current);

  for (let index = 0; index < Math.max(latest.length, installed.length); index++) {
    const left = latest[index] ?? 0;
    const right = installed[index] ?? 0;
    if (left !== right) return left > right;
  }
  return false;
}

async function checkForUpdate() {
  const notice = document.getElementById("updateNotice");
  if (!notice) return;

  try {
    const installed = chrome.runtime.getManifest();
    const remote = await fetch(UPDATE_CHECK_URL, { cache: "no-store" }).then((response) => response.json());
    if (!isNewer(remote.version, installed.version)) return;

    const link = document.createElement("a");
    link.href = `https://github.com/FoxRefire/wvg/archive/${remote.version_name}.zip`;
    link.target = "_blank";
    link.rel = "noreferrer";
    link.textContent = "Download";

    notice.textContent = `Version ${remote.version} is available. `;
    notice.appendChild(link);
    notice.style.display = "block";
  } catch {
    // Offline, or the check is unreachable: stay quiet.
  }
}

document.addEventListener("DOMContentLoaded", checkForUpdate);
