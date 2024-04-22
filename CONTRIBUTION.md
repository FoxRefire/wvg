# How can I contribute to this project?
First, please read the technical explanation at the bottom of the README and other websites to understand the basic workings of Widevine DRM and this extension.

## Submit Schemes
If you find a website where this extension does not work, you can contribute to this project by submitting a scheme.

Some websites do not send or receive challenge or license raw data directly, but instead encode it in Base64 or append JSON data, so the general Widevine scheme cannot retrieve the keys properly.

Such a trick is called License wrapping.

For more informations:

https://shaka-player-demo.appspot.com/docs/api/tutorial-license-wrapping.html

https://reference.dashif.org/dash.js/latest/samples/drm/license-wrapping.html

You can submit schemes in [python/schemes/](https://github.com/FoxRefire/wvg/tree/next/python/schemes).

Copy the `CommonWV.py` in the directory and edit it so that the request body sent to the license server and the final `license` variable value processed by Pywidevine and used to obtain the key are appropriate.

## JSON rules for License URL and scheme selection
I plan to allow the extension to handle JSON rules for automatic selection of license URLs and schemes later.

JSON rules will be able to determine the appropriate license URL and scheme based on regular expressions.

## Improve UI
Add CSS file to the extension to improve the form design.

## Translate Extension
If you would like to translate this extension into your native language, please contact me via Issues.

If there are many applicants, I'll prepare for localization.

## Host public API for legacy extension
Due to my Koyeb account has banned, Public API for legacy extension is down.

If you host your public API, please contact me at Issues.

Read here for how to deploy WVCore.Server.

https://github.com/FoxRefire/wvg/issues/3#issuecomment-2066959592
