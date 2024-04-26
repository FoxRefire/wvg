import base64
import re
import js
req = base64.b64decode(licBody.encode()).decode()
b64challenge = base64.b64encode(challenge).decode()
req = re.sub(r'(?<=\"message\":\").*(?=\"})', b64challenge, req)
print(req)
# res = await (await pyfetch(licUrl,
#     method="POST",
#     headers=licHeaders,
#     body=req
# )).json()
res = js.window.corsFetch(licUrl, "POST", licHeaders, req)
licence = base64.b64decode(res['license'].encode())
