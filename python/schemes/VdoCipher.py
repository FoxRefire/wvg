b64challenge = base64.b64encode(challenge).decode()

payload = loadBody("json")
decoded_token = json.loads(base64.b64decode(payload['token']).decode())
decoded_token['licenseRequest'] = b64challenge
payload = {"token": base64.b64encode(json.dumps(decoded_token).encode()).decode()}

res = await corsFetch(licUrl, "POST", licHeaders, payload, "json")
licence = res["license"]
