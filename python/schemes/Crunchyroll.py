licHeaders = json.loads(licHeaders)
challenge = cdm.get_license_challenge(session_id, pssh)
licence = await corsFetch(licUrl, "POST", licHeaders, challenge, "json")
licence = licence['license']