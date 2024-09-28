import xml.etree.ElementTree as ET
challenge_with_cert = getChallenge('b64', Cdm.common_privacy_cert)
licence = await corsFetch(licUrl, "POST", licHeaders, challenge_with_cert, "blob")
licence = ET.fromstring(licence).find('.//{http://www.canal-plus.com/DRM/V1}license').text