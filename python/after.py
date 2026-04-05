try:
    if 'licence' not in globals():
        raise Exception("The scheme failed to provide a 'licence' variable. Check your CORS or license URL.")
    cdm.parse_license(session_id, licence)
except Exception as e:
    js.document.getElementById('result').value=f"[{schemeName}] Doesn't fit, choose another challenge scheme!\n\nError: {str(e)}\n\nLicense Response:\n{licence if 'licence' in globals() else 'Not fetched'}"
    raise Exception(e)

# get keys
keys=""
for key in cdm.get_keys(session_id):
    if key.type=="CONTENT":
        keys+=f"{key.kid.hex}:{key.key.hex()}\n"

# close session, disposes of session data
cdm.close(session_id)
keys
