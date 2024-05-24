import urllib.parse
payload = f"widevine2Challenge={urllib.parse.quote(base64.b64encode(challenge).decode())}&includeHdcpTestKeyInLicense=true"

licHeaders['User-Agent'] = "Mozilla/5.0 (X11; Linux x86_64; rv:126.0) Gecko/20100101 Firefox/126.0"

res = await js.corsFetch(licUrl, "POST", json.dumps(licHeaders), payload)
res = json.loads(base64.b64decode(res.encode()).decode())
licence = base64.b64decode(res['widevine2License']['license'].encode())

