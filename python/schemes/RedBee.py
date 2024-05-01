from pyodide.ffi import to_js
req = json.loads(base64.b64decode(licBody.encode()).decode())
b64challenge = base64.b64encode(challenge).decode()
req['message'] = b64challenge
# res = await (await pyfetch(licUrl,
#     method="POST",
#     headers=licHeaders,
#     body=req
# )).json()
res = await js.corsFetch(licUrl, "POST", to_js(licHeaders), json.dumps(req))
res = json.loads(base64.b64decode(res.encode()).decode())
print(res)
licence = base64.b64decode(res['license'].encode())
