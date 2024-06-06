import urllib.parse
payload = urllib.parse.parse_qs(loadBody("str"))
challengeB64 = base64.b64encode(challenge).decode()
payload['licenseRequest'] = challengeB64
payload = urllib.parse.urlencode(payload)

res = await corsFetch(licUrl, "POST", licHeaders, payload, "json")
licence = res['data']

