payload = json.loads(licBody)
challengeArr = list(challenge)
payload['license_request_data']=challengeArr
licence = await (await pyfetch(licUrl,
    method="POST",
    headers=licHeaders,
    body=payload
)).bytes()
