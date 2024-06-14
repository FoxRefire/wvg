import re
b64challenge = base64.b64encode(challenge).decode()
res = await (await pyfetch(licUrl,
method="POST",
headers=licHeaders,
body=b64challenge
)).text()

licence = base64.b64decode(re.search(".*(.*)<\/license>", str(res))[2].encode())
