body = loadBody('json')
body['params']['object'] = getChallenge('b64', Cdm.common_privacy_cert)
licence = await corsFetch(licUrl, "POST", licHeaders, body, "json")
licence = licence['result']['object']['license']