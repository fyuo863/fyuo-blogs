import { build } from 'vite';
import { mkdir, readFile, readdir, writeFile, copyFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import { zipSync, unzipSync } from 'fflate';
const frontend = fileURLToPath(new URL('../', import.meta.url));
const id = 'predictive-captions';
const version = process.argv[2] || '0.1.1';
if (!/^[a-z0-9][a-z0-9._-]{0,79}$/.test(version) || version.includes('..')) throw new Error('Invalid version');
const out = path.join(frontend, 'plugin-dist', id);
const source = path.join(frontend, 'plugins', id);
await build({configFile:path.join(frontend,'vite.plugins.config.js'),build:{outDir:out,lib:{entry:path.join(source,'entry.jsx')}}});
await build({configFile:false,base:'./',build:{outDir:out,emptyOutDir:false,copyPublicDir:false,minify:true,lib:{entry:path.join(source,'asr-worker.js'),formats:['es'],fileName:()=> 'asr-worker.js'},rollupOptions:{external:['onnxruntime-web/webgpu','onnxruntime-common'],output:{codeSplitting:false,paths:{'onnxruntime-web/webgpu':'./ort.js','onnxruntime-common':'./ort.js'}}}}});
await copyFile(path.join(source,'recorder.js'),path.join(out,'recorder.js'));
const runtime = path.join(frontend,'node_modules/onnxruntime-web/dist');
await copyFile(path.join(runtime,'ort.webgpu.bundle.min.mjs'),path.join(out,'ort.js'));
const stem = 'ort-wasm-simd-threaded.jsep';
await copyFile(path.join(runtime,`${stem}.mjs`),path.join(out,'runtime.mjs'));
const wasm = await readFile(path.join(runtime,`${stem}.wasm`));
const parts=[];
for(let offset=0;offset<wasm.length;offset+=7*1024*1024){
 const name=`runtime-${parts.length}.bin`; parts.push(name);
 await writeFile(path.join(out,name),wasm.subarray(offset,offset+7*1024*1024));
}
await writeFile(path.join(out,'runtime.json'),JSON.stringify({parts,module:'runtime.mjs'}));
await writeFile(path.join(out,'manifest.json'),JSON.stringify({id,name:'预测字幕',version,route:`/p/${id}`,entry:'entry.js',styles:['style.css'],type:'module',apiVersion:1,enabled:true,navigation:{label:'预测字幕',order:50},permissions:['microphone','display-capture']},null,2));
await writeFile(path.join(out,'LICENSES.txt'),'Application: repository license. Transformers.js: Apache-2.0. ONNX Runtime: MIT. Whisper model downloaded separately: Apache-2.0.\n\n'+await readFile(path.join(frontend,'node_modules/@huggingface/transformers/LICENSE'),'utf8')+'\n'+await readFile(path.join(source,'LICENSE-onnx.txt'),'utf8'));
const entries={}; let total=0;
for(const name of await readdir(out)){
 const data=await readFile(path.join(out,name)); total+=data.length;
 if(data.length>8*1024*1024) throw new Error(`Oversized plugin file: ${name}`);
 entries[name]=data;
}
if(total>64*1024*1024||Object.keys(entries).length>200)throw new Error('Plugin exceeds unpacked limits');
const zip=zipSync(entries,{level:6});
if(zip.length>32*1024*1024)throw new Error('Plugin ZIP exceeds upload limit');
for(const [name,data] of Object.entries(unzipSync(zip)))if(!Buffer.from(data).equals(entries[name]))throw new Error('ZIP roundtrip mismatch');
await mkdir(path.join(frontend,'plugin-packages'),{recursive:true});
const target=path.join(frontend,'plugin-packages',`${id}-${version}.zip`);
await writeFile(target,zip);
console.log(`Built ${target}; ZIP ${(zip.length/1024/1024).toFixed(1)} MiB; unpacked ${(total/1024/1024).toFixed(1)} MiB. Not uploaded.`);
