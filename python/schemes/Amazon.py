import urllib.parse
payload = f"widevine2Challenge={urllib.parse.quote(base64.b64encode(challenge).decode())}&includeHdcpTestKeyInLicense=true"

licHeaders['User-Agent'] = "Mozilla/5.0 (X11; Linux x86_64; rv:126.0) Gecko/20100101 Firefox/126.0"

res = await corsFetch(licUrl, "POST", licHeaders, payload, "json")
licence = res['widevine2License']['license']

