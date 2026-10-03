#!/usr/bin/env python3
"""Integration smoke test against disposable stage containers only."""
import http.client,ssl,socket,subprocess,json,pathlib,io,zipfile,time,struct,zlib
ip=subprocess.check_output(['docker','inspect','-f','{{range .NetworkSettings.Networks}}{{.IPAddress}}{{end}}','blog-stage-nginx'],text=True).strip()
secrets=dict(line.split('=',1) for line in pathlib.Path('/data/blog-security-stage/stage.env').read_text().splitlines() if '=' in line)
class Connection(http.client.HTTPSConnection):
    def connect(self):
        self.sock=ssl.create_default_context().wrap_socket(socket.create_connection((ip,443),timeout=10),server_hostname=self.host)
def request(host,path,method='GET',body=None,headers=None):
    conn=Connection(host,timeout=10);headers=dict(headers or {})
    if isinstance(body,dict):body=json.dumps(body).encode();headers['Content-Type']='application/json'
    conn.request(method,path,body,headers);response=conn.getresponse();data=response.read();status=response.status;result=dict(response.getheaders());conn.close()
    return status,{k.lower():v for k,v in result.items()},data
public='fyuoblog.top';admin='www.fyuoblog.top'
def check(expected,host,path,**kwargs):
    result=request(host,path,**kwargs)
    assert result[0]==expected, f'{path}: expected {expected}, got {result[0]}'
    return result
_,headers,_=check(200,public,'/');assert 'strict-transport-security' in headers
_,headers,_=check(200,admin,'/');assert "frame-ancestors 'none'" in headers['content-security-policy']
check(404,admin,'/plugin-assets/probe/1/entry.js')
for path in ['/.env','/.git/config']:check(404,public,path)
check(401,admin,'/api/v1/admin/plugins')
check(403,admin,'/api/v1/admin/plugins',headers={'Origin':'https://fyuoblog.top'})
check(403,public,'/api/v1/signin',method='POST',body={})
check(413,admin,'/api/v1/signin',method='POST',body=b'x'*4097)
_,_,data=check(200,admin,'/api/v1/signin',method='POST',body={'name':secrets['LOCAL_ADMIN_NAME'],'password':secrets['LOCAL_ADMIN_PASSWORD']})
profile=json.loads(data)['data'];auth={'Authorization':'Bearer '+profile['token']}
check(204,admin,'/api/v1/auth/verify',headers=auth)
# Exercise actual image storage under the non-root container account.
def chunk(kind,data):
    return struct.pack('!I',len(data))+kind+data+struct.pack('!I',zlib.crc32(kind+data))
png=b'\x89PNG\r\n\x1a\n'+chunk(b'IHDR',struct.pack('!2I5B',1,1,8,2,0,0,0))+chunk(b'IDAT',zlib.compress(b'\x00\xff\xff\xff'))+chunk(b'IEND',b'')
image_body=b'--image-boundary\r\nContent-Disposition: form-data; name="file"; filename="probe.png"\r\nContent-Type: image/png\r\n\r\n'+png+b'\r\n--image-boundary--\r\n'
_,_,data=check(201,admin,'/api/v1/uploads/images',method='POST',body=image_body,headers={**auth,'Content-Type':'multipart/form-data; boundary=image-boundary'})
image_url=json.loads(data)['data']['url']
check(200,public,image_url)
check(200,admin,image_url)
# All uploads and mutations target the restored, isolated database and files.
version=str(time.time_ns())
manifest={'id':'security-probe','name':'Security probe','version':version,'type':'module','apiVersion':1,'entry':'entry.js'}
archive=io.BytesIO()
with zipfile.ZipFile(archive,'w') as z:z.writestr('manifest.json',json.dumps(manifest));z.writestr('entry.js','export default function Page(){return null}')
boundary='fyuo-stage-boundary';multipart=(f'--{boundary}\r\nContent-Disposition: form-data; name="file"; filename="probe.zip"\r\nContent-Type: application/zip\r\n\r\n'.encode()+archive.getvalue()+f'\r\n--{boundary}--\r\n'.encode())
check(201,admin,'/api/v1/admin/plugins',method='POST',body=multipart,headers={**auth,'Content-Type':f'multipart/form-data; boundary={boundary}'})
check(404,public,'/api/v1/plugins/security-probe/manifest')
check(200,admin,f'/api/v1/admin/plugins/security-probe/publish/{version}',method='POST',headers=auth)
check(200,public,'/api/v1/plugins/security-probe/manifest')
check(200,public,f'/plugin-assets/security-probe/{version}/entry.js')
check(200,admin,'/api/v1/admin/plugins/security-probe/disable',method='POST',headers=auth)
check(404,public,f'/plugin-assets/security-probe/{version}/entry.js')
_,_,data=check(201,admin,'/api/v1/admin/api-keys',method='POST',body={'name':'security-smoke','user_id':profile['id']},headers=auth)
key=json.loads(data)['data'];mcp={'X-Blog-Api-Key':key['key'],'Accept':'application/json, text/event-stream'}
_,headers,_=check(200,public,'/mcp',method='POST',headers=mcp,body={'jsonrpc':'2.0','id':1,'method':'initialize','params':{'protocolVersion':'2024-11-05','capabilities':{},'clientInfo':{'name':'smoke','version':'1'}}})
sid=headers['mcp-session-id'];mcp['Mcp-Session-Id']=sid
check(403,public,'/mcp',method='DELETE',headers={**mcp,'X-Blog-Api-Key':'wrong-key'})
check(200,public,'/mcp',method='POST',headers=mcp,body={'jsonrpc':'2.0','id':2,'method':'tools/list','params':{}})
check(200,admin,f"/api/v1/admin/api-keys/{key['item']['id']}",method='PATCH',headers=auth,body={'enabled':False})
check(401,public,'/mcp',method='POST',headers=mcp,body={'jsonrpc':'2.0','id':3,'method':'tools/list','params':{}})
check(204,admin,'/api/v1/signout',method='POST',headers=auth)
check(401,admin,'/api/v1/admin/plugins',headers=auth)
statuses=[request(admin,'/api/v1/signin',method='POST',body={'name':'rate-probe','password':'invalid'})[0] for _ in range(8)]
assert 429 in statuses
print('PASS: TLS, headers, origin isolation, request bounds, login/logout revocation, plugin lifecycle, MCP identity/revocation, throttling')
