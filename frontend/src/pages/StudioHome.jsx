import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { getHomeContent } from '../api';
import { useShowcase } from '../showcase/useShowcase';
import ProjectGrid from '../module/ProjectGrid';
import HalftoneTitle from '../components/HalftoneTitle';

const fallback = [
  { title: 'fyuobot-ts', description: '事件驱动的轻量化 Agent 框架。', linkUrl: 'https://github.com/fyuo863/fyuobot-ts', tag: 'AGENT FRAMEWORK' },
  { title: 'fyuo-blogs', description: '写作、作品与实验的个人空间。', linkUrl: 'https://github.com/fyuo863/fyuo-blogs', tag: 'PERSONAL PLATFORM' },
  { title: 'go-file-fetch', description: '用 Go 构建的多线程文件下载器。', linkUrl: 'https://github.com/fyuo863/go-file-fetch', tag: 'DEVELOPER TOOL' },
  { title: 'fyuo-ops', description: '面向运维场景的 Agent 探索。', linkUrl: 'https://github.com/fyuo863/fyuo-ops', tag: 'OPS EXPERIMENT' },
];

function safeLink(url) {
  try { const parsed = new URL(url); return parsed.protocol === 'https:' && !parsed.username && !parsed.password ? parsed.href : null; }
  catch { return null; }
}

function Poster({ project, index, compact = false }) {
  const [failed, setFailed] = useState(false);
  const href = safeLink(project.linkUrl);
  const title = project.title?.replace(/\.$/, '') || 'Untitled';
  const contents = <>
    <div className="studio-poster__art">
      {project.image && !failed ? <img src={project.image} alt="" loading="lazy" draggable="false" onError={() => setFailed(true)} /> : <div className="studio-poster__graphic" aria-hidden="true"><b>{title.split('-')[0]}<br />{title.split('-').slice(1).join('-') || 'project'}</b><i>↗</i></div>}
    </div>
    <div className="studio-poster__caption"><h3>{title}</h3><span aria-hidden="true">↗</span></div>
    {!compact && <p>{project.description}</p>}
  </>;
  return href ? <a className="studio-poster" data-tone={index % 4} href={href} target="_blank" rel="noreferrer">{contents}</a> : <article className="studio-poster" data-tone={index % 4}>{contents}</article>;
}

export default function StudioHome() {
  const showcase = useShowcase();
  const [saved, setSaved] = useState(null);
  const rail = useRef(null);
  const railDrag = useRef(null);
  const suppressRailClick = useRef(false);
  const [railProgress, setRailProgress] = useState(0);
  const [railScrollable, setRailScrollable] = useState(false);
  useEffect(() => {
    let active = true;
    getHomeContent().then(response => { if (active) setSaved(response.data?.data || null); }).catch(() => {});
    return () => { active = false; };
  }, []);
  const projects = showcase.albums ?? (saved?.projects?.length ? saved.projects.map(project => ({ ...project, linkUrl: project.link_url })) : fallback);
  useEffect(() => {
    const element = rail.current;
    if (!element) return undefined;
    const update = () => {
      const maximum = element.scrollWidth - element.clientWidth;
      setRailScrollable(maximum > 1);
      setRailProgress(maximum > 0 ? element.scrollLeft / maximum * 1000 : 0);
    };
    const observer = new ResizeObserver(update);
    observer.observe(element);
    element.addEventListener('scroll', update, { passive: true });
    update();
    return () => { observer.disconnect(); element.removeEventListener('scroll', update); };
  }, [projects.length]);
  return <div className="studio-home">
    <section className="studio-hero" aria-labelledby="studio-title">
      <div className="studio-keyvisual">
        <HalftoneTitle as="div"><span>PROJECTS</span><span>&amp; NOTES</span></HalftoneTitle>
      </div>
      <div className="studio-latest">
        <h1 id="studio-title"><span>SELECTED</span>WORKS</h1>
        {projects.length ? <>
          <div className="studio-poster-rail" ref={rail} tabIndex="0" role="region" aria-label="精选项目，可横向滚动"
            onPointerDown={event => { if (event.button !== 0 || event.pointerType === 'touch') return; suppressRailClick.current = false; railDrag.current = { id: event.pointerId, x: event.clientX, left: event.currentTarget.scrollLeft }; }}
            onPointerMove={event => { const drag = railDrag.current; if (!drag || drag.id !== event.pointerId) return; const distance = event.clientX - drag.x; if (Math.abs(distance) > 6) { suppressRailClick.current = true; if (!event.currentTarget.hasPointerCapture(event.pointerId)) event.currentTarget.setPointerCapture(event.pointerId); event.currentTarget.scrollLeft = drag.left - distance; } }}
            onPointerUp={event => { railDrag.current = null; if (event.currentTarget.hasPointerCapture(event.pointerId)) event.currentTarget.releasePointerCapture(event.pointerId); }}
            onPointerCancel={() => { railDrag.current = null; suppressRailClick.current = false; }}
            onClickCapture={event => { if (suppressRailClick.current) { event.preventDefault(); event.stopPropagation(); suppressRailClick.current = false; } }}
            onDragStart={event => event.preventDefault()}
          >{projects.slice(0, 6).map((project, index) => <Poster key={project.id || `${project.title}-${index}`} project={project} index={index} compact />)}</div>
          <div className="studio-rail-scroll"><input type="range" min="0" max="1000" step="1" value={railProgress} disabled={!railScrollable} aria-label="横向浏览精选项目" onChange={event => { const progress = Number(event.target.value); setRailProgress(progress); const element = rail.current; if (element) element.scrollTo({ left: progress / 1000 * (element.scrollWidth - element.clientWidth), behavior: 'instant' }); }} /></div>
          <div className="studio-rail-controls"><a className="studio-all-works" href="#works">ALL WORKS<span aria-hidden="true">→</span></a></div>
        </> : <p className="studio-empty">暂未添加展示项目。<Link to="/blog">先读一篇博客 ↗</Link></p>}
      </div>
    </section>
    <section className="studio-work" id="works" aria-labelledby="studio-works-title">
      <h2 id="studio-works-title">WORKS</h2>
      {showcase.error && <p className="studio-data-note" role="status">{showcase.error}</p>}
      <ProjectGrid projects={projects} showHeading={false} showNavigation={false} />
    </section>
    <section className="studio-journal"><div><h2>ONE MORE<br />THING</h2></div><nav aria-label="更多页面"><Link to="/blog">JOURNAL<span>博客</span></Link><Link to="/plugins">PLAYGROUND<span>插件</span></Link></nav></section>
    <footer className="studio-footer"><p>FYUO</p><div><a href="https://beian.miit.gov.cn/" target="_blank" rel="noreferrer">浙ICP备2026038123号</a></div></footer>
  </div>;
}
