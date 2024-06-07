payload = loadBody("json")
b64challenge = base64.b64encode(challenge).decode()
payload["getWidevineLicense"]["widevineChallenge"]=b64challenge
res = await (await pyfetch(licUrl,
    method="POST",
    headers=licHeaders,
    body=json.dumps(payload)
)).json()
licence = res["getWidevineLicenseResponse"]["license"]
