import xml.etree.ElementTree as ET
b64challenge = base64.b64encode(challenge).decode()
res = await corsFetch(licUrl, "POST", licHeaders, b64challenge, "str")

licence = ET.XML(res)[0][0].text
