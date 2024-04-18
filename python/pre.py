from pywidevine.cdm import Cdm
from pywidevine.device import Device
from pywidevine.pssh import PSSH

import json
from pyodide.http import pyfetch

# prepare pssh
pssh = PSSH(pssh)

# load device
with open('device.wvd', 'wb') as f:
    wvdExt=await (await pyfetch("device.wvd")).bytes()
    f.write(wvdExt)
device = Device.load("device.wvd")

# load cdm
cdm = Cdm.from_device(device)

# open cdm session
session_id = cdm.open()

# get license challenge
challenge = cdm.get_license_challenge(session_id, pssh)

licHeaders=json.loads(licHeaders)
