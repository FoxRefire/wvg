licHeaders = json.loads(licHeaders)
challenge = cdm.get_license_challenge(session_id, pssh)
payload_data_license = {
    "LatensRegistration":{
        "FriendlyName":"telia-tv-client",
        "CustomerName":"Telia TV PROD",
        "AccountName":"737495",
        "PortalId":"4fd1ec82-c6f2-445b-8736-fe858fd9d234",
        "DeviceInfo":{
            "FormatVersion":"1",
            "DeviceType":"PC",
            "DRMProvider":"Google",
            "DRMType":"Widevine",
            "DRMVersion":"0",
            "OSType":"Win32",
            "DeviceVendor":"Google Inc.",
            "DeviceModel":""}
    },
    "Payload":f"{base64.b64encode(challenge).decode('utf-8')}"
}
json_string_license = json.dumps(payload_data_license)
json_string_license = base64.b64encode(json_string_license.encode('utf-8')).decode('utf-8')
licence = await corsFetch(licUrl, "POST", licHeaders, json_string_license, "json")
licence = licence['license']