import http from 'node:http';
import path from 'node:path';
import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
const frontend=fileURLToPath(new URL('../',import.meta.url));
const plugin=path.join(frontend,'plugin-dist/predictive-captions');
const manifest=JSON.parse(await readFile(path.join(plugin,'manifest.json'),'utf8'));
const types={'.html':'text/html','.js':'text/javascript','.mjs':'text/javascript','.css':'text/css','.json':'application/json','.bin':'application/octet-stream','.svg':'image/svg+xml'};
const server=http.createServer(async(req,res)=>{
 try{
  if(req.method!=='GET'){res.writeHead(405).end();return;}
  const uri=new URL(req.url,'http://localhost').pathname;
  if(uri==='/api/v1/plugins'){res.setHeader('Content-Type','application/json');res.end(JSON.stringify({data:[{slug:manifest.id,name:manifest.name}]}));return;}
  if(uri===`/api/v1/plugins/${manifest.id}/manifest`){res.setHeader('Content-Type','application/json');res.end(JSON.stringify({data:manifest}));return;}
  if(uri.startsWith('/api/')){res.writeHead(404).end();return;}
  const prefix=`/plugin-assets/${manifest.id}/${manifest.version}/`;
  const root=uri.startsWith(prefix)?plugin:path.join(frontend,'dist');
  const relative=uri.startsWith(prefix)?decodeURIComponent(uri.slice(prefix.length)):uri.startsWith('/assets/')?decodeURIComponent(uri.slice(1)):'index.html';
  const file=path.resolve(root,relative);
  if(!file.startsWith(root+path.sep)){res.writeHead(403).end();return;}
  const body=await readFile(file);res.setHeader('Content-Type',types[path.extname(file)]||'application/octet-stream');res.end(body);
 }catch{res.writeHead(404).end('Not found');}
});
server.listen(5188,'127.0.0.1',()=>console.log('Caption preview: http://127.0.0.1:5188/p/predictive-captions'));
