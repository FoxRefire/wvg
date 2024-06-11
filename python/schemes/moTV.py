payload = loadBody("json")

b64challenge = base64.b64encode(challenge).decode()
payload['rawLicense'] = b64challenge

res = await corsFetch(licUrl, "POST", licHeaders, payload, "json")
licence = res['rawLicense']
