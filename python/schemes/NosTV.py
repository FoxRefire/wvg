b64challenge = base64.b64encode(challenge).decode()
res = await (await pyfetch(licUrl,
    method="POST",
    headers=licHeaders,
    body=json.dumps({"challenge": b64challenge})
)).json()
licence = base64.b64decode(res["license"][0].encode())
