b64challenge = base64.b64encode(challenge).decode()

payload = json.loads(base64.b64decode(licBody.encode()).decode())
decoded_token = json.loads(base64.b64decode(payload['token']).decode())
decoded_token['licenseRequest'] = b64challenge
payload = {"token": base64.b64encode(json.dumps(decoded_token).encode()).decode()}

res = await js.corsFetch(licUrl, "POST", json.dumps(licHeaders), json.dumps(payload))
res = json.loads(base64.b64decode(res.encode()).decode())

licence = base64.b64decode(res["license"].encode())
js.chrome.extension.getBackgroundPage().isBlock=True
