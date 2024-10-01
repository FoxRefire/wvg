try:
    cdm.parse_license(session_id, licence)
except Exception as e:
    js.document.getElementById('result').value=f"Could not decrypt!\n\nLicense Response:\n{licence}\n\nhttps://github.com/FoxRefire/wvg/wiki/How-to-add-custom-license-scheme-yourself"
    raise Exception(e)

# get keys
keys=""
for key in cdm.get_keys(session_id):
    if key.type=="CONTENT":
        keys+=f"{key.kid.hex}:{key.key.hex()}\n"

# close session, disposes of session data
cdm.close(session_id)
keys
