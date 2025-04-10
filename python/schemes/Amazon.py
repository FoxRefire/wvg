payload = loadBody("json")
payload['licenseChallenge'] = getChallenge("b64")
licence = await corsFetch(licUrl, "POST", licHeaders, payload, "json")
licence = licence['widevineLicense']['license']
