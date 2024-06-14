payload = loadBody("json")

b64challenge = base64.b64encode(challenge).decode()
payload['requests'][3]['params']['challenge'] = b64challenge

res = await corsFetch(licUrl, "POST", licHeaders, payload, "json")
licence = res['license']

