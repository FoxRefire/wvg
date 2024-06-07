req = loadBody("json")
b64challenge = base64.b64encode(challenge).decode()
req['licenseRequest'] = b64challenge
res = await corsFetch(licUrl, "POST", licHeaders, req, "json")
licence = res['license']
