def replace_widevine_challenge(dictionary, challenge):
    for key, value in dictionary.items():
        if 'widevine' in key.lower() or 'license' in key.lower():
            dictionary[key] = challenge
        elif isinstance(value, dict):
            replace_widevine_challenge(value, challenge)

def find_widevine_license(dictionary):
    for key, value in dictionary.items():
        if 'widevine' in key.lower() or 'license' in key.lower():
            license = dictionary[key].replace("-", "+").replace("_", "/")
            return license
        elif isinstance(value, dict):
            find_widevine_license(value)
service_cert = 'CAUSxwUKwQIIAxIQFwW5F8wSBIaLBjM6L3cqjBiCtIKSBSKOAjCCAQoCggEBAJntWzsyfateJO_DtiqVtZhSCtW8yzdQPgZFuBTYdrjfQFEEQa2M462xG7iMTnJaXkqeB5UpHVhYQCOn4a8OOKkSeTkwCGELbxWMh4x-Ib_7_up34QGeHleB6KRfRiY9FOYOgFioYHrc4E-shFexN6jWfM3rM3BdmDoh-07svUoQykdJDKR-ql1DghjduvHK3jOS8T1v-2RC_THhv0CwxgTRxLpMlSCkv5fuvWCSmvzu9Vu69WTi0Ods18Vcc6CCuZYSC4NZ7c4kcHCCaA1vZ8bYLErF8xNEkKdO7DevSy8BDFnoKEPiWC8La59dsPxebt9k-9MItHEbzxJQAZyfWgkCAwEAAToUbGljZW5zZS53aWRldmluZS5jb20SgAOuNHMUtag1KX8nE4j7e7jLUnfSSYI83dHaMLkzOVEes8y96gS5RLknwSE0bv296snUE5F-bsF2oQQ4RgpQO8GVK5uk5M4PxL_CCpgIqq9L_NGcHc_N9XTMrCjRtBBBbPneiAQwHL2zNMr80NQJeEI6ZC5UYT3wr8-WykqSSdhV5Cs6cD7xdn9qm9Nta_gr52u_DLpP3lnSq8x2_rZCR7hcQx-8pSJmthn8NpeVQ_ypy727-voOGlXnVaPHvOZV-WRvWCq5z3CqCLl5-Gf2Ogsrf9s2LFvE7NVV2FvKqcWTw4PIV9Sdqrd-QLeFHd_SSZiAjjWyWOddeOrAyhb3BHMEwg2T7eTo_xxvF-YkPj89qPwXCYcOxF-6gjomPwzvofcJOxkJkoMmMzcFBDopvab5tDQsyN9UPLGhGC98X_8z8QSQ-spbJTYLdgFenFoGq47gLwDS6NWYYQSqzE3Udf2W7pzk4ybyG4PHBYV3s4cyzdq8amvtE_sNSdOKReuHpfQ='
service_cert = service_cert.replace("-", "+").replace("_", "/")
cdm.set_service_certificate(session_id=session_id, certificate=service_cert)
challenge = cdm.get_license_challenge(session_id, pssh)
licHeaders = json.loads(licHeaders)
licBody = loadBody()
licBody = base64.b64decode(licBody).decode('utf-8')
licBody = json.loads(licBody)
replace_widevine_challenge(licBody, base64.b64encode(challenge).decode('utf-8'))
licence = await corsFetch(licUrl, "POST", licHeaders, licBody, "json")
licence = find_widevine_license(licence)