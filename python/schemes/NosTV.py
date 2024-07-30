b64challenge = base64.b64encode(challenge).decode()
res = await corsFetch(licUrl, "POST", licHeaders, {"challenge": b64challenge}, "json")

licence = res["license"][0]
