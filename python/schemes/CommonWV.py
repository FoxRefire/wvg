licHeaders=json.loads(licHeaders)

# get license challenge
challenge = cdm.get_license_challenge(session_id, pssh)

licence = await corsFetch(licUrl, "POST", licHeaders, challenge, "blob")
