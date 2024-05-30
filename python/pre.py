from pywidevine.cdm import Cdm
from pywidevine.device import Device, DeviceTypes
from pywidevine.pssh import PSSH

import json
import js
import base64
from pyodide.http import pyfetch

def blobsToDevice(cID, pKey):
    return Device(client_id=cID, private_key=pKey, type_=DeviceTypes['ANDROID'], security_level=3, flags=None)

async def loadCdm():
    # Looking for device.wvd
    try:
        wvd = await (await pyfetch("device.wvd")).bytes()
        return Cdm.from_device(Device.loads(wvd))
    except:
        pass

    # Looking for device_client_id_blob + device_private_key
    try:
        cID=await (await pyfetch("device_client_id_blob")).bytes()
        pKey=await (await pyfetch("device_private_key")).bytes()
        return Cdm.from_device(blobsToDevice(cID, pKey))
    except:
        pass

    # Looking for client_id.bin + private_key.pem
    try:
        cID=await (await pyfetch("client_id.bin")).bytes()
        pKey=await (await pyfetch("private_key.pem")).bytes()
        return Cdm.from_device(blobsToDevice(cID, pKey))
    except Exception as e:
        js.document.getElementById('result').value="n0suchd3v1c3f113:r3adth3fuck1ngma2ua1\n\n[MPD?]\nhttps://github.com/FoxRefire/wvg?tab=readme-ov-file#instalation"
        raise Exception(e)


# prepare pssh
pssh = PSSH(pssh)

# load cdm
cdm = await loadCdm()

# open cdm session
session_id = cdm.open()

# get license challenge
challenge = cdm.get_license_challenge(session_id, pssh)

licHeaders=json.loads(licHeaders)

js.chrome.extension.getBackgroundPage().isBlock=False
