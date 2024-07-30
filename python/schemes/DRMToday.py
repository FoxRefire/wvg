res = await corsFetch(licUrl, "POST", licHeaders, challenge, "json")

licence = res['license']

