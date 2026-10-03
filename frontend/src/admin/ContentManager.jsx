import { useCallback, useEffect, useRef, useState } from 'react';
import BlogPost from '../components/BlogPost';
import { uploadArticleImage } from '../api';

const blankArticle = {title:'',content:'',tags:[],cover_image:'',stage:'draft',vol:1};
const blankPlace = {name:'',latitude:'',longitude:'',gallery:[],route:[]};
const blankHome = {cover_github_url:'',cover_description:'',projects:[]};
const fields = {
  home: [['cover_github_url','封面 GitHub 仓库'],['cover_description','封面简介']],
  travel: [['name','地点'],['latitude','纬度'],['longitude','经度']],
};
export default function ContentManager({token}) {
  const [kind,setKind] = useState('articles');
  const [items,setItems] = useState([]);
  const [draft,setDraft] = useState(null);
  const [error,setError] = useState('');
  const [busy,setBusy] = useState(false);
  const [page,setPage] = useState(1);
  const [total,setTotal] = useState(0);
  const editRef = useRef(null);
  const endpoint = kind === 'home' ? 'home-content' : kind === 'travel' ? 'travel-places' : 'articles';
  const request = useCallback(async (path, method='GET', body) => {
    const response = await fetch(`/api/v1/${path}`, { method, headers:{Authorization:`Bearer ${token}`,'Content-Type':'application/json'}, body:body === undefined ? undefined : JSON.stringify(body) });
    const result = await response.json().catch(()=>({}));
    if(!response.ok) throw new Error(result.error || `请求失败 (${response.status})`);
    return result;
  },[token]);
  const load = useCallback(async () => {
    const result=await request(`${endpoint}${kind==='articles'?`?page=${page}&page_size=50`:''}`);
    if(kind==='home') setDraft(result.data || blankHome);
    else {setItems(result.data || []);setTotal(result.total || 0);}
  },[endpoint,kind,page,request]);
  useEffect(()=>{ let active=true; const timer=setTimeout(()=>{if(active) load().catch(e=>setError(e.message));},0);return()=>{active=false;clearTimeout(timer);}; },[load]);
  const change = (name,value) => setDraft(current=>({...current,[name]:value}));
  const run = async action => {setBusy(true);setError('');try{await action();}catch(e){setError(e.message);}finally{setBusy(false);}};
  const save = event => {event.preventDefault();void run(async()=>{
    let payload=draft;
    if(kind==='articles') payload={...draft,title:editRef.current.getTitle(),content:editRef.current.getContent(),cover_image:editRef.current.getCoverImage(),tags:editRef.current.getTags()};
    if(kind==='travel') payload={...draft,latitude:Number(draft.latitude),longitude:Number(draft.longitude)};
    const path=endpoint+(kind!=='home'&&draft.id?`/${draft.id}`:'');
    await request(path,kind==='home'||draft.id?'PUT':'POST',payload);setDraft(null);await load();
  });};
  const remove = () => {if(!window.confirm('删除这条内容？'))return;void run(async()=>{await request(`${endpoint}/${draft.id}`,'DELETE');setDraft(null);await load();});};
  const upload = async file => {const r=await uploadArticleImage(file,token);return r.data.data.url;};
  return <section className="secure-content" aria-label="内容编辑">
    <nav className="secure-content__tabs" aria-label="内容分类">{[['articles','文章'],['home','首页内容'],['travel','旅行记录']].map(([key,label])=><button key={key} disabled={busy} aria-pressed={kind===key} onClick={()=>{setKind(key);setDraft(null);setItems([]);setPage(1);setError('');}}>{label}</button>)}</nav>
    {error && <p role="alert">{error}</p>}
    {kind!=='home' && !draft && <><header className="secure-content__heading"><h2>{kind==='articles'?'文章':'旅行记录'}</h2><button className="secure-content__primary" onClick={()=>setDraft(kind==='articles'?{...blankArticle}:{...blankPlace})}>新建</button></header><ul className="secure-content__list">{items.map(item=><li key={item.id}><button disabled={busy} onClick={()=>void run(async()=>setDraft(kind==='articles'?(await request(`articles/${item.id}`)).data:item))}><span className="secure-content__item-title">{item.title || item.name || '未命名'}</span><span className="secure-content__item-meta">{kind==='articles'?(item.stage==='published'?'已发布':'草稿'):'地点'}<span aria-hidden="true"> ↗</span></span></button></li>)}</ul>
      {kind==='articles'&&<nav className="secure-content__pagination" aria-label="分页"><button disabled={page===1} onClick={()=>setPage(p=>p-1)}>上一页</button><span>第 {page} 页</span><button disabled={page*50>=total} onClick={()=>setPage(p=>p+1)}>下一页</button></nav>}</>}
    {draft&&<form className="secure-content__form" onSubmit={save}>
      <h2>{kind==='home'?'首页内容':`${draft.id?'编辑':'新建'}${kind==='articles'?'文章':'旅行记录'}`}</h2>
      {kind==='articles'? <><BlogPost key={draft.id || 'new'} post={draft} isEditing editRef={editRef} onBack={()=>setDraft(null)} onUploadImage={upload}/><label>状态<select value={draft.stage} onChange={e=>change('stage',e.target.value)}><option value="draft">草稿</option><option value="published">已发布</option></select></label><label>期数<input type="number" value={draft.vol} onChange={e=>change('vol',Number(e.target.value))}/></label></>:
        fields[kind].map(([name,label])=><label key={name}>{label}<input required value={draft[name]??''} onChange={e=>change(name,e.target.value)}/></label>)}
      {kind==='home'&&<fieldset><legend>项目</legend>{(draft.projects||[]).map((project,i)=><div key={i}>
        <label>GitHub 仓库<input type="url" required value={project.link_url} onChange={e=>change('projects',draft.projects.map((p,j)=>j===i?{...p,link_url:e.target.value}:p))}/></label>
        <label>简介<textarea required value={project.description} onChange={e=>change('projects',draft.projects.map((p,j)=>j===i?{...p,description:e.target.value}:p))}/></label>
        <button type="button" onClick={()=>change('projects',draft.projects.filter((_,j)=>i!==j))}>移除项目</button>
      </div>)}<button type="button" onClick={()=>change('projects',[...(draft.projects||[]),{link_url:'',description:''}])}>添加项目</button></fieldset>}
      {kind==='travel'&&<>
        <label>图片地址（每行一个）<textarea value={(draft.gallery||[]).join('\n')} onChange={e=>change('gallery',e.target.value.split('\n'))}/></label>
        <label>路线（每行：纬度,经度）<textarea value={draft.routeText ?? (draft.route||[]).map(p=>`${p.latitude},${p.longitude}`).join('\n')} onChange={e=>{const value=e.target.value;setDraft(d=>({...d,routeText:value,route:value.split('\n').filter(x=>x.trim()).map(x=>{const[a,b]=x.split(',');return{latitude:Number(a),longitude:Number(b)};})}));}}/></label>
      </>}
      <footer><button className="secure-content__primary" disabled={busy} type="submit">{busy?'保存中…':'保存'}</button>{draft.id&&kind!=='home'&&<button type="button" disabled={busy} onClick={remove}>删除</button>}<button type="button" disabled={busy} onClick={()=>setDraft(null)}>取消</button></footer>
    </form>}
  </section>;
}
