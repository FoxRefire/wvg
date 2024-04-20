## WVGuesserExtension-NextGen
Extension works standalone.

Not anymore need WVCore.Server API setup!

Looking for legacy version?: https://github.com/FoxRefire/wvg/tree/legacy

### Instalation

1. Donwload or clone this code
2. At the same directory of `manifest.json`(root directory of this extension), put the device file named `device.wvd`
3. Install extension
   
   * Firefox
     
     1\. Navigate to `about:debugging#/runtime/this-firefox`
     
     2\. Load temporary addon
   
   * Chrome

     1\. Navigate to `chrome://extensions/`

     2\. Load unpacked

   * Kiwi Browser(Android) NOTE:Remote API needed; Not work with Termux for now

     1\. Navigate to ︙ --> Extensions

     2\. \+(from .zip/.crx/.user.js)

### Demo
[demo.webm](https://github.com/FoxRefire/wvg/assets/155989196/f2f41e88-1fc5-4954-89d4-3dc4552258e2)


### Todo

* Improve UI

### Disclaimer

This extension is for educational and researchment purpose.

Only use it for content for which you own the rights and do not use it for piracy purposes.

### How it works?

![名称未設定ファイル drawio](https://github.com/FoxRefire/wvg/assets/155989196/ef233474-7af9-4648-b64d-5b62cf801938)

1. inject.js injected by content.js gets Widevine PSSH by hooking EME.
2. background.js fetches POST URLs/Headers
3. PSSHs will passed by this route inject.js-->content.js-->background.js-->popup.js
4. PSSHs+URLs+Headers will passed by this route background.js-->popup.js
5. popup.js will contols UI(popup.html)
6. User input into UI
7. popup.js calls pywidevine script using pyodide in browser

### Big Thanks and inspired by
https://github.com/emarsden/pssh-box-wasm/

