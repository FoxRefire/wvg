body = loadBody('json')
challenge_with_cert = getChallenge('b64', Cdm.common_privacy_cert)
body['licenseRequest'] = challenge_with_cert
licence = await corsFetch(licUrl, "POST", licHeaders, body, "json")
licence = licence['license'].replace("-", "+").replace("_", "/")
