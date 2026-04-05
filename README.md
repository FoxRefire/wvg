## WVGuesserExtension-NextGen

#### For more details, see [docs](https://github.com/FoxRefire/wvg/wiki)

### What's New in VreelXYZ Version

This update brings the Widevine L3 Decrypter to modern browser standards while significantly improving the user experience with a complete UI overhaul and functional refinements.

### 🧪 Compatibility & Testing:
Tested on: Google Chrome (Latest Version).
Target Platforms: Designed to be compatible with all Chromium-based browsers (Edge, Brave, Opera, etc.) that support Manifest V3.

### 🛠 Technical Changes (Manifest V3 Migration)

- Manifest Architecture: Migrated from Manifest V2 to Manifest V3. 
- Service Worker: Converted the legacy background page into a high-performance Service Worker (background.js). 
- Communication Layer: Implemented chrome.runtime.sendMessage for robust communication between the popup and the background service worker. 
- Native Popup: Switched from manual chrome.windows.create logic to the native default_popup implementation in manifest.json, ensuring the extension behaves like a modern tool. 

### 🎨 Design & UI/UX Overhaul

- Dark Theme: Implemented a "Flutter-inspired" dark aesthetic using a deep indigo/slate palette (#0f172a). 
- Responsive Layout: Increased the default width to 800px to provide better readability for long PSSH and License strings. Optimized the layout to be clean, centered, and professional. 
- Micro-interactions: Added smooth transitions, hover effects on buttons, and styled scrollbars for a premium feel. 
- History Page: Fully redesigned the history window to match the main application’s look and feel. 

### ✨ New Features & Improvements

- One-Click Copy: Added convenient "Copy" buttons for PSSH, License URL, and the Resulting Keys. 
- Clean Key Output: The results are now automatically cleaned. We removed unnecessary scheme prefixes (e.g., 0000...:0000...), so you get raw, ready-to-use keys immediately. 
- Enhanced Error Diagnostics: Removed generic "Error" messages. The UI now displays the actual server response from the license server, making it much easier to debug failed requests. 
- Optimized Formats: Standardized input fields and buttons with subtle borders and clear focus states. 

### 🐛 Bug Fixes

- Fixed the issue where the popup would open as a separate browser window instead of a standard extension menu. 
- Resolved layout "clipping" issues for users on high-density displays. 
- Improved the cleanup of the result field between different decryption attempts.


<img width="995" height="645" alt="wdv" src="https://github.com/user-attachments/assets/d6b7c588-1762-465a-b195-695dce1bce64" />

<img width="991" height="641" alt="wdv2" src="https://github.com/user-attachments/assets/4ac5a066-bdae-45f9-9754-9ecb48313bfc" />


### Installation

1. Download or clone this code
2. At the same directory of `manifest.json`(root directory of this extension), put the one of the following Android L3 CDM key pair file(s).

   *Don't know how to get these files? See [How to dump CDM key pair](https://github.com/FoxRefire/wvg/wiki/How-to-dump-CDM-key-pair) for more informations.*

   * Supported CDM Key Pair Formats

      1. `device.wvd`

      2. `device_client_id_blob` + `device_private_key`

      3. `client_id.bin` + `private_key.pem`

      4. `remote.json` ([How to use Remote CDM](https://github.com/FoxRefire/wvg/wiki/Using-with-Remote-CDM))
3. Install extension
   
   * Firefox ([Permanent method](https://github.com/FoxRefire/wvg/wiki/Permanent-install-method-for-Firefox))
     
     1\. Navigate to `about:debugging#/runtime/this-firefox`
     
     2\. Load temporary addon
   
   * Chrome

     1\. Navigate to `chrome://extensions/`

     2\. Load unpacked

   * Kiwi Browser(Android)

     1\. Navigate to ︙ --> Extensions

     2\. \+(from .zip/.crx/.user.js)

### Demo
[Screencast_20240505_014046.webm](https://github.com/FoxRefire/wvg/assets/155989196/dbb07fde-a368-40f7-8209-711d5586009e)

## Third-party libraries
* [Pyodide](https://github.com/pyodide/pyodide) ([MPL-2.0](https://github.com/pyodide/pyodide/blob/main/LICENSE))
* [Pywidevine](https://github.com/devine-dl/pywidevine) ([GPL-3.0](https://github.com/devine-dl/pywidevine/blob/master/LICENSE))
* [json-view](https://github.com/pgrabovets/json-view) ([MIT](https://github.com/pgrabovets/json-view/blob/master/LICENSE))

### Big Thanks and inspired by
https://github.com/emarsden/pssh-box-wasm/

