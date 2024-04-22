## WVGuesserExtension-NextGen
Extension works standalone.

Not anymore need WVCore.Server API setup!

Looking for legacy version?: https://github.com/FoxRefire/wvg/tree/legacy

### Instalation

1. Download or clone this code
2. At the same directory of `manifest.json`(root directory of this extension), put the one of the following Android L3 CDM file(s).
   * Supported CDM Types

      1\. `device.wvd`

      2\. `device_client_id_blob` + `device_private_key`

      3\. `client_id.bin` + `private_key.pem`
3. Install extension
   
   * Firefox
     
     1\. Navigate to `about:debugging#/runtime/this-firefox`
     
     2\. Load temporary addon
   
   * Chrome

     1\. Navigate to `chrome://extensions/`

     2\. Load unpacked

   * Kiwi Browser(Android)

     1\. Navigate to ︙ --> Extensions

     2\. \+(from .zip/.crx/.user.js)

### Demo
[demo.webm](https://github.com/FoxRefire/wvg/assets/155989196/f2f41e88-1fc5-4954-89d4-3dc4552258e2)


### Todo

* Improve UI
* Localization
* JSON rules for License URL and scheme selection

For contributors, see here:
https://github.com/FoxRefire/wvg/blob/next/CONTRIBUTION.md

### Disclaimer

This extension is for educational and researchment purpose.

Only use it for content for which you own the rights and do not use it for piracy purposes.

### How it works?

![image](https://github.com/FoxRefire/wvg/assets/155989196/91a52607-9d24-4072-8c25-c4dc7d062415)


1. inject.js injected by content.js gets Widevine PSSH by hooking EME.
2. background.js fetches POST URLs/Headers
3. PSSHs will passed by this route inject.js-->content.js-->background.js-->popup.js
4. PSSHs+URLs+Headers will passed by this route background.js-->popup.js
5. popup.js will contols UI(popup.html)
6. User input into UI
7. popup.js calls pywidevine script using pyodide in browser

### Big Thanks and inspired by
https://github.com/emarsden/pssh-box-wasm/

