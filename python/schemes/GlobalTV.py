payload = loadBody("json")
challengeArr = list(challenge)
payload['license_request_data']=challengeArr

licence = await corsFetch(licUrl, "POST", licHeaders, payload, "blob")
