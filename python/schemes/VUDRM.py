payload = loadBody("json")

challengeArr = list(challenge)
payload['drm_info'] = challengeArr

licence = await corsFetch(licUrl, "POST", licHeaders, payload, "blob")

