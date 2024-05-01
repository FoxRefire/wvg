import base64
payload = json.loads(base64.b64decode(licBody.encode()).decode())
challengeB64 = base64.b64encode(challenge).decode()
payload['params']['object'] = challengeB64
licence = await (await pyfetch(licUrl,
    method="POST",
    headers=licHeaders,
    body=json.dumps(payload)
)).json()
base64.b64decode(licence['result']['object']['license'].encode())
