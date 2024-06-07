payload = loadBody("json")
challengeB64 = base64.b64encode(challenge).decode()
payload['params']['object'] = challengeB64
licence = await (await pyfetch(licUrl,
    method="POST",
    headers=licHeaders,
    body=json.dumps(payload)
)).json()
licence = licence['result']['object']['license']
