// Local, read-only preview of built packages. Does not upload or publish them.
import { createServer } from 'vite';
import { readFile } from 'node:fs/promises';
const ids=['ai-coding','plugin-architecture'];
const manifests=await Promise.all(ids.map(async id=>JSON.parse(await readFile(new URL(`../plugin-dist/${id}/manifest.json`,import.meta.url),'utf8'))));
const server=await createServer({server:{host:'127.0.0.1',port:5182,strictPort:true},plugins:[{
  name:'local-playground-packages',
  transformIndexHtml:html=>html.replace('<title>','<title>本地插件预览 · '),
  configureServer(vite){vite.middlewares.use(async(req,res,next)=>{
    const url=new URL(req.url,'http://127.0.0.1:5182');
    const json=(data,status=200)=>{res.statusCode=status;res.setHeader('Content-Type','application/json; charset=utf-8');res.end(JSON.stringify(data));};
    const asset=/^\/plugin-assets\/([\w-]+)\/([\w.-]+)\/(entry.js|style.css)$/.exec(url.pathname);
    if(asset){
      const manifest=manifests.find(m=>m.id===asset[1]&&m.version===asset[2]);
      if(!manifest)return json({error:'Local package missing'},404);
      res.setHeader('Content-Type',asset[3].endsWith('.css')?'text/css':'text/javascript');
      return res.end(await readFile(new URL(`../plugin-dist/${manifest.id}/${asset[3]}`,import.meta.url)));
    }
    if(!url.pathname.startsWith('/api/v1/'))return next();
    if(req.method!=='GET')return json({error:'本地预览禁止写入'},403);
    if(url.pathname==='/api/v1/plugins')return json({data:manifests.map(m=>({slug:m.id,name:m.name,active_version:m.version}))});
    const manifest=manifests.find(m=>url.pathname===`/api/v1/plugins/${m.id}/manifest`);
    if(manifest)return json({data:manifest});
    try{
      const response=await fetch(`https://fyuoblog.top${url.pathname}${url.search}`,{signal:AbortSignal.timeout(12000)});
      res.statusCode=response.status;res.setHeader('Content-Type','application/json');res.end(await response.text());
    }catch{return json({error:'公共接口暂时无法读取'},503);}
  });}
}]});
await server.listen();server.printUrls();
