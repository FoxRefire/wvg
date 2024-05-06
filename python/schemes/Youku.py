import urllib.parse
from pyodide.ffi import to_js
payload = urllib.parse.parse_qs(base64.b64decode(licBody.encode()).decode())
challengeB64 = base64.b64encode(challenge).decode()
payload['licenseRequest'] = challengeB64
payload = urllib.parse.urlencode(payload)

res = await js.corsFetch(licUrl, "POST", to_js(licHeaders), payload)
res = json.loads(base64.b64decode(res.encode()).decode())
licence = base64.b64decode(res['data'].encode())

