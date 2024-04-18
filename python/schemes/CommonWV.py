licence = await (await pyfetch(licUrl,
    method="POST",
    headers=licHeaders,
    body=challenge
)).bytes()
