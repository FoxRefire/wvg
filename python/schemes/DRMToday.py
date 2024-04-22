import base64
res = await (await pyfetch(licUrl,
    method="POST",
    headers=licHeaders,
    body=challenge
)).json()
licence = base64.b64decode(res['license'].encode())

