# parse license challenge
try:
    cdm.parse_license(session_id, licence)
except Exception as e:
    js.document.getElementById('result').value="sch3m3n0t6upp0rt:y0ucanr3qu3st0rsu6mit\n\n[MPD?]\nhttps://gist.github.com/FoxRefire/fd606ec29a9bfa1f1bef897e0dc3a231"
    raise Exception(e)

# get keys
keys=""
for key in cdm.get_keys(session_id):
    if key.type=="CONTENT":
        keys+=f"{key.kid.hex}:{key.key.hex()}\n"

# close session, disposes of session data
cdm.close(session_id)
keys
