import urllib.parse
payload = urllib.parse.parse_qs(loadBody("str"))
challengeB64 = base64.b64encode(challenge).decode()
# keep payload value as list
payload['licenseRequest'] = [challengeB64]
# convert payload to a dictionary with a single value
payload = {k: v[0] for k, v in payload.items()}
payload = urllib.parse.urlencode(payload)

res = await corsFetch(licUrl, "POST", licHeaders, payload, "json")
licence = res['data']
