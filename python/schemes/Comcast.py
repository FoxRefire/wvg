from pyodide.ffi import to_js
req = json.loads(base64.b64decode(licBody.encode()).decode())
b64challenge = base64.b64encode(challenge).decode()
req['licenseRequest'] = b64challenge
res = await js.corsFetch(licUrl, "POST", to_js(licHeaders), json.dumps(req))
res = json.loads(base64.b64decode(res.encode()).decode())
licence = base64.b64decode(res['license'].encode())
