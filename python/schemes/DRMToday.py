res = await (await pyfetch(licUrl,
    method="POST",
    headers=licHeaders,
    body=challenge
)).json()
licence = res['license']

