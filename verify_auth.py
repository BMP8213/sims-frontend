import json, urllib.request
payload = json.dumps({'username':'admin','password':'Admin@2026'}).encode()
req = urllib.request.Request('http://localhost:8000/api/auth/login/', data=payload, headers={'Content-Type':'application/json'})
with urllib.request.urlopen(req) as res:
    body = json.loads(res.read().decode())
    token = body.get('access')
    print('TOKEN_OK', bool(token))
    req2 = urllib.request.Request('http://localhost:8000/api/students/', headers={'Authorization': f'Bearer {token}'})
    try:
        with urllib.request.urlopen(req2) as res2:
            print('STATUS', res2.status)
            print(res2.read().decode()[:400])
    except Exception as e:
        print(type(e).__name__, e)
        if hasattr(e, 'read'):
            print(e.read())
