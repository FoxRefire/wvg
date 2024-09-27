from pywidevine.cdm import Cdm
from pywidevine.remotecdm import RemoteCdm
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
    except:
        pass

    # Looking for remote.json
    try:
        remote_conf=await (await pyfetch("remote.json")).json()
        return RemoteCdm(**remote_conf)
    except Exception as e:
        js.document.getElementById('result').value="n0suchd3v1c3f113:r3adth3fuck1ngma2ua1\n\n[MPD?]\nhttps://github.com/FoxRefire/wvg/wiki/Getting-started#2-put-cdm-files"
        raise Exception(e)

# Define corsFetch API for requesting server that require origin header
async def corsFetch(url: str, method: str, headers: [dict, str], body: [dict, bytes, str], resType: str="blob"):
    if type(headers) == dict:
        headers = json.dumps(headers)

    match body:
        case bytes(): body = base64.b64encode(body).decode()
        case str(): body = base64.b64encode(body.encode()).decode()
        case dict(): body = base64.b64encode(json.dumps(body).encode()).decode()

    res = await js.corsFetch(url, method, headers, body)
    res = base64.b64decode(res.encode())

    match resType:
        case "blob": pass
        case "str": res = res.decode()
        case "json": res = json.loads(res.decode())

    return res

# Define loadBody API for loading requestBody to scheme concisely
def loadBody(loadAs: str):
    global licBody
    licBody = base64.b64decode(licBody.encode())

    match loadAs:
        case "blob": pass
        case "str": licBody = licBody.decode()
        case "json": licBody = json.loads(licBody.decode())

    return licBody

# Define a function to get challenge if needed to set a service cert
def getChallenge(getAs, *cert):
    global session_id
    global pssh

    if bool(cert):
        cdm.set_service_certificate(session_id, cert[0])

    challenge = cdm.get_license_challenge(session_id, pssh)

    match getAs:
        case "blob": pass
        case "b64": challenge = base64.b64encode(challenge).decode()
        case "list": challenge = list(challenge)
    return challenge

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