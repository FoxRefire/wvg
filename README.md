## WVGuesserExtension-NextGen

Looking for legacy version?: https://github.com/FoxRefire/wvg/tree/legacy

#### For more details, see [docs](https://github.com/FoxRefire/wvg/wiki)

### Installation

1. Download or clone this code
2. At the same directory of `manifest.json`(root directory of this extension), put the one of the following Android L3 CDM file(s).

   *Don't know how to get these files? See [How to dump CDM key pair](https://github.com/FoxRefire/wvg/wiki/How-to-dump-CDM-key-pair) for more informations.*

   * Supported CDM Types

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

