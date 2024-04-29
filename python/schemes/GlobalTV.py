import base64
payload = json.loads(base64.b64decode(licBody.encode()).decode())
challengeArr = list(challenge)
payload['license_request_data']=challengeArr
licence = await (await pyfetch(licUrl,
    method="POST",
    headers=licHeaders,
    body=json.dumps(payload)
)).bytes()
