## WVGuesserExtension

Looking for new version?

See here: https://github.com/FoxRefire/wvg/tree/next

### Instalation

1. Setup [Guesser API](https://github.com/nilaoda/WVCore.Server) ([Guide](https://github.com/nilaoda/Blog/discussions/58#discussioncomment-9052557))

2. Install extension
   
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

![diagram drawio](https://github.com/FoxRefire/wvg/assets/155989196/d1196125-ab07-4f5a-baed-c60d8c47bceb)
1. inject.js injected by content.js gets Widevine PSSH by hooking EME.
2. background.js fetches POST URLs/Headers
3. PSSHs will passed by this route inject.js-->content.js-->background.js-->popup.js
4. PSSHs+URLs+Headers will passed by this route background.js-->popup.js
5. popup.js will contols UI(popup.html)
6. User input into UI
7. popup.js sends key request to Guesser API
