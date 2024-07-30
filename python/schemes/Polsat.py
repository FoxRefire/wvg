payload = loadBody("json")
challengeB64 = base64.b64encode(challenge).decode()
payload['params']['object'] = challengeB64
res = await corsFetch(licUrl, "POST", licHeaders, payload, "json")

licence = res['result']['object']['license']
