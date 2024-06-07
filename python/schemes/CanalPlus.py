payload = loadBody("json")

b64challenge = base64.b64encode(challenge).decode()
payload['ServiceRequest']['InData']['ChallengeInfo'] = b64challenge

res = await corsFetch(licUrl, "POST", licHeaders, payload, "json")
licence = res['ServiceResponse']['OutData']['LicenseInfo']
