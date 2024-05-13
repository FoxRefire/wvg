from pywidevine.cdm import Cdm
from pywidevine.device import Device, DeviceTypes
from pywidevine.pssh import PSSH

import json
import js
import base64
from pyodide.http import pyfetch

# prepare pssh
pssh = PSSH(pssh)

# load device
try:
    wvd = await (await pyfetch("device.wvd")).bytes()
    device = Device.loads(wvd)
except Exception:
    try:
        print("device.wvd not found! looking for device_client_id_blob and device_private_key...")
        cID=await (await pyfetch("device_client_id_blob")).bytes()
        pKey=await (await pyfetch("device_private_key")).bytes()

    except Exception:
        try:
            print("device_client_id_blob and device_private_key not found! looking for client_id.bin and private_key.pem...")
            cID=await (await pyfetch("client_id.bin")).bytes()
            pKey=await (await pyfetch("private_key.pem")).bytes()

        except Exception as e:
            js.document.getElementById('result').value="n0suchd3v1c3f113:r3adth3fuck1ngma2ua1\n\n[MPD?]\nhttps://github.com/FoxRefire/wvg?tab=readme-ov-file#instalation"
            raise Exception(e)

    device = Device(client_id=cID,
                private_key=pKey,
                type_=DeviceTypes['ANDROID'],
                security_level=3,
                flags=None)

# load cdm
cdm = Cdm.from_device(device)

# open cdm session
session_id = cdm.open()

# get license challenge
challenge = cdm.get_license_challenge(session_id, pssh)

licHeaders=json.loads(licHeaders)
