import ReactMarkdown from "react-markdown";
import { useEffect, useId, useRef, useState } from "react";

const clamp = (value, minimum, maximum) => Math.min(Math.max(value, minimum), maximum);

const createWoodGrainLine = (lineIndex, phase) => {
  const baseline = lineIndex * 15 - 165;
  const points = [];

  for (let x = -120; x <= 1320; x += 24) {
    const knotDistance = Math.hypot((x - 600 + Math.sin(phase * 0.26) * 38) * 0.78, baseline - 450);
    const knot = Math.sin(knotDistance * 0.073) * 28 * Math.exp(-knotDistance / 245);
    const warp = Math.sin(x * 0.012 + phase * 0.22) * 28
      + Math.sin(baseline * 0.31 + x * 0.007 + phase * 0.48) * 16
      + Math.sin(x * 0.008 - baseline * 0.09 + phase * 0.74) * 5
      + knot;
    points.push(`${x === -120 ? "M" : "L"} ${x} ${baseline + warp}`);
  }

  return points.join(" ");
};

const createWoodGrainFrame = (phase = 0) => Array.from({ length: 86 }, (_, index) => ({
  path: createWoodGrainLine(index, phase),
  width: 0.52 + ((Math.sin(index * 1.91 + phase * 1.08) + 1) / 2) ** 2 * 1.18,
}));

const useWoodGrainFrame = (surfaceRef) => {
  const [frame, setFrame] = useState(() => createWoodGrainFrame());

  useEffect(() => {
    const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const fps = new URLSearchParams(window.location.search).get('__plugin_preview') === '1' ? 6 : 18;
    let visible = false;
    const observer = new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; });
    if (surfaceRef.current) observer.observe(surfaceRef.current);
    let animationFrame = 0;
    let lastUpdate = 0;
    let startTime = performance.now();

    const renderFrame = (time) => {
      if (visible && !document.hidden && !motionQuery.matches && time - lastUpdate >= 1000 / fps) {
        setFrame(createWoodGrainFrame((time - startTime) / 1000));
        lastUpdate = time;
      }
      animationFrame = window.requestAnimationFrame(renderFrame);
    };

    const resetForMotionPreference = () => {
      window.cancelAnimationFrame(animationFrame);
      if (motionQuery.matches) {
        setFrame(createWoodGrainFrame());
        return;
      }
      startTime = performance.now();
      lastUpdate = 0;
      animationFrame = window.requestAnimationFrame(renderFrame);
    };

    resetForMotionPreference();
    motionQuery.addEventListener("change", resetForMotionPreference);
    return () => {
      observer.disconnect();
      window.cancelAnimationFrame(animationFrame);
      motionQuery.removeEventListener("change", resetForMotionPreference);
    };
  }, [surfaceRef]);

  return frame;
};

function WoodGrainField({ className = "cover-flow__wood-grain" }) {
  const surfaceRef = useRef(null);
  const lines = useWoodGrainFrame(surfaceRef);
  return (
    <svg ref={surfaceRef} className={className} viewBox="0 0 1200 900" preserveAspectRatio="none" aria-hidden="true" focusable="false">
      <g className="cover-flow__wood-grain-line">
        {lines.map((line, index) => <path d={line.path} key={`grain-${index}`} strokeWidth={line.width} />)}
      </g>
    </svg>
  );
}

function ProjectGrid({ projects = [], showHeading = true, showNavigation = true }) {
  const reflectionFilterId = `reflection-${useId().replace(/[^a-zA-Z0-9_-]/g, "")}`;
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [flippedKey, setFlippedKey] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const dragRef = useRef(null);
  const rootRef = useRef(null);
  const previousFlip = useRef(null);
  const suppressClickRef = useRef(false);
  const selectedIndexRef = useRef(0);
  const activeIndex = clamp(selectedIndex, 0, Math.max(0, projects.length - 1));

  useEffect(() => {
    selectedIndexRef.current = activeIndex;
  }, [activeIndex]);

  useEffect(() => {
    if (flippedKey || previousFlip.current) rootRef.current?.querySelector(flippedKey ? '[data-flipped=true] .cover-flow__return' : '[data-active=true] .cover-flow__front')?.focus({preventScroll:true});
    previousFlip.current = flippedKey;
  }, [flippedKey]);

  if (!projects.length) return <div className="cover-flow__stage">{showHeading && <h2 className="section-title cover-flow__heading" id="projects-title"><span className="section-title__selected">Selected work.</span></h2>}<p className="cover-flow__empty">暂无专辑。</p></div>;
  const activeProject = projects[activeIndex];
  const selectProject = (nextIndex) => {
    const targetIndex = clamp(nextIndex, 0, projects.length - 1);
    const currentIndex = selectedIndexRef.current;
    if (targetIndex === currentIndex) return;
    selectedIndexRef.current = targetIndex;
    setFlippedKey(null);
    setSelectedIndex(targetIndex);
  };
  const selectRelative = (direction) => selectProject(selectedIndexRef.current + direction);

  const onStageKeyDown = (event) => {
    if (event.key === "Escape") setFlippedKey(null);
    if (event.target.closest(".cover-flow__back")) return;
    if (event.key === "ArrowLeft") {
      event.preventDefault();
      selectRelative(-1);
    }
    if (event.key === "ArrowRight") {
      event.preventDefault();
      selectRelative(1);
    }
  };

  const onPointerDown = (event) => {
    if (event.button !== 0 || event.target.closest(".cover-flow__back")) return;
    dragRef.current = {
      pointerId: event.pointerId,
      startX: event.clientX,
      lastX: event.clientX,
      lastTime: event.timeStamp,
      velocity: 0,
      step: Math.max(72, event.currentTarget.clientWidth * 0.22),
      startIndex: activeIndex,
    };
    setIsDragging(true);

  };

  const onPointerMove = (event) => {
    const drag = dragRef.current;
    if (drag?.pointerId !== event.pointerId) return;
    if (Math.abs(event.clientX - drag.startX) > 8 && !event.currentTarget.hasPointerCapture(event.pointerId)) event.currentTarget.setPointerCapture(event.pointerId);
    const elapsed = Math.max(1, event.timeStamp - drag.lastTime);
    const instantVelocity = (event.clientX - drag.lastX) / elapsed;
    drag.velocity = drag.velocity * 0.72 + instantVelocity * 0.28;
    drag.lastX = event.clientX;
    drag.lastTime = event.timeStamp;
    const targetIndex = clamp(drag.startIndex - Math.round((event.clientX - drag.startX) / drag.step), 0, projects.length - 1);
    selectProject(targetIndex);
  };

  const finishDrag = (event, cancelled = false) => {
    const drag = dragRef.current;
    if (drag?.pointerId !== event.pointerId) return;
    const delta = cancelled ? 0 : event.clientX - drag.startX;
    const projectedOffset = cancelled ? 0 : delta + drag.velocity * 240;
    const targetIndex = clamp(drag.startIndex - Math.round(projectedOffset / drag.step), 0, projects.length - 1);
    suppressClickRef.current = Math.abs(delta) > 8 || targetIndex !== drag.startIndex;
    if (suppressClickRef.current) window.setTimeout(() => { suppressClickRef.current = false; }, 0);
    if (!cancelled) selectProject(targetIndex);
    setIsDragging(false);
    dragRef.current = null;
    if (event.currentTarget.hasPointerCapture(event.pointerId)) event.currentTarget.releasePointerCapture(event.pointerId);
  };

  return (
    <section ref={rootRef} className="project-grid cover-flow" aria-label="Project cover flow" style={{"--cover-reflection-filter": `url("#${reflectionFilterId}")`}}>
      <svg width="0" height="0" aria-hidden="true" focusable="false" style={{position:"absolute"}}>
        <defs><filter id={reflectionFilterId} x="0" y="0" width="100%" height="100%" colorInterpolationFilters="sRGB">
          <feFlood floodColor="var(--color-paper-3)" floodOpacity="0.68" />
          <feComposite in2="SourceGraphic" operator="atop" />
        </filter></defs>
      </svg>
      <div className={`cover-flow__stage${isDragging ? " is-dragging" : ""}`} role="region" aria-roledescription="Cover flow" aria-label="Project covers. Drag horizontally to browse quickly, or use left and right arrow keys." tabIndex="0" onKeyDown={onStageKeyDown} onPointerDown={onPointerDown} onPointerMove={onPointerMove} onPointerUp={finishDrag} onPointerCancel={(event) => finishDrag(event, true)}>
        <WoodGrainField />
        {showHeading && <h2 className="section-title cover-flow__heading" id="projects-title"><span className="section-title__selected">Selected work.</span></h2>}
        {projects.map((project, index) => {
          const offset = index - activeIndex;
          const distance = Math.abs(offset);
          const turn = offset === 0 ? 0 : offset > 0 ? -68 : 68;
          const horizontalOffset = Math.sign(offset) * 198 * (1 - (2 / 3) ** distance);
          const key = project.id || project.linkUrl || project.title;
          const flipped = index === activeIndex && flippedKey === key;
          const style = {
            transform: `translate(-50%, -50%) translateX(${horizontalOffset}%) translateZ(${-distance * 5.5}rem) rotateY(${turn}deg) scale(${flipped ? 1.25 : Math.max(0.7, 1 - distance * 0.07)})`,
            zIndex: projects.length - distance,
          };

          const faces = (<>
                <button className="cover-flow__front" type="button" aria-label={`查看 ${project.title}`} aria-expanded={flipped} inert={flipped} tabIndex={flipped || distance > 3 ? -1 : 0}
                  onClick={(event) => {
                    if (suppressClickRef.current) { event.preventDefault(); suppressClickRef.current = false; return; }
                    if (index !== activeIndex) selectProject(index);
                    else setFlippedKey(key);
                  }}>
                  {project.image ? <img src={project.image} alt={project.title} draggable="false" onError={event => { event.currentTarget.hidden=true; event.currentTarget.nextElementSibling.hidden=false; }} /> : null}
                  <span className="cover-flow__fallback" hidden={Boolean(project.image)}>{project.title}</span>
                </button>
                <section className="cover-flow__back" aria-label={`${project.title} 详情`} aria-hidden={!flipped} inert={!flipped}>
                  <button className="cover-flow__return" type="button" onClick={() => setFlippedKey(null)} aria-label="返回封面">↶</button>
                  <h3>{project.title}</h3>
                  <div className="cover-flow__back-content" tabIndex={flipped ? 0 : -1} onScroll={event => {
                    const reflection = event.currentTarget.closest("article")?.querySelector(".cover-flow__reflection .cover-flow__back-content");
                    if (reflection && reflection !== event.currentTarget) reflection.scrollTop = event.currentTarget.scrollTop;
                  }}>
                    {project.description && <p>{project.description}</p>}
                    {project.content && <ReactMarkdown urlTransform={url => { try { const target = new URL(url, project.contentBase || window.location.href); return target.protocol === 'https:' && !target.username && !target.password ? target.href : ''; } catch { return ''; } }} components={{a: ({children, href}) => <a href={href} target="_blank" rel="noopener noreferrer">{children}</a>}}>{project.content}</ReactMarkdown>}
                  </div>
                  {project.linkUrl && <a className="cover-flow__open" href={project.linkUrl} target="_blank" rel="noopener noreferrer">打开项目 ↗</a>}
                </section>
              </>);
          return (
            <article className="cover-flow__item" key={key} style={style} data-active={index === activeIndex} data-flipped={flipped}>
              <div className="cover-flow__sleeve">{faces}</div>
              <div className="cover-flow__reflection" aria-hidden="true" inert>
                <div className="cover-flow__sleeve">{faces}</div>
              </div>
            </article>
          );
        })}
      </div>

      {showNavigation && <div className="cover-flow__navigation">
        <p aria-live="polite">{activeProject.title}</p>
        <div className="cover-flow__controls" aria-label="Project navigation">
          <button className="cover-flow__button" type="button" onClick={() => selectRelative(-1)} aria-label="Previous project" disabled={activeIndex === 0}>←</button>
          <button className="cover-flow__button" type="button" onClick={() => selectRelative(1)} aria-label="Next project" disabled={activeIndex === projects.length - 1}>→</button>
        </div>
      </div>}
    </section>
  );
}

export default ProjectGrid;
