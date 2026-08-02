import { useEffect, useRef, useState } from "react";

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

const useWoodGrainFrame = () => {
  const [frame, setFrame] = useState(() => createWoodGrainFrame());

  useEffect(() => {
    const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    let animationFrame = 0;
    let lastUpdate = 0;
    let startTime = performance.now();

    const renderFrame = (time) => {
      if (!motionQuery.matches && time - lastUpdate >= 1000 / 18) {
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
      window.cancelAnimationFrame(animationFrame);
      motionQuery.removeEventListener("change", resetForMotionPreference);
    };
  }, []);

  return frame;
};

function WoodGrainField({ lines, className = "cover-flow__wood-grain" }) {
  return (
    <svg className={className} viewBox="0 0 1200 900" preserveAspectRatio="none" aria-hidden="true" focusable="false">
      <g className="cover-flow__wood-grain-line">
        {lines.map((line, index) => <path d={line.path} key={`grain-${index}`} strokeWidth={line.width} />)}
      </g>
    </svg>
  );
}

function ProjectGrid({ projects = [] }) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const woodGrainLines = useWoodGrainFrame();
  const dragRef = useRef(null);
  const suppressClickRef = useRef(false);
  if (!projects.length) return null;
  const activeIndex = selectedIndex % projects.length;
  const activeProject = projects[activeIndex];
  const selectRelative = (direction) => setSelectedIndex((current) => Math.max(0, Math.min(projects.length - 1, current + direction)));

  const onStageKeyDown = (event) => {
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
    if (event.button !== 0) return;
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
    event.currentTarget.setPointerCapture(event.pointerId);
  };

  const onPointerMove = (event) => {
    const drag = dragRef.current;
    if (drag?.pointerId !== event.pointerId) return;
    const elapsed = Math.max(1, event.timeStamp - drag.lastTime);
    const instantVelocity = (event.clientX - drag.lastX) / elapsed;
    drag.velocity = drag.velocity * 0.72 + instantVelocity * 0.28;
    drag.lastX = event.clientX;
    drag.lastTime = event.timeStamp;
    const targetIndex = clamp(drag.startIndex - Math.round((event.clientX - drag.startX) / drag.step), 0, projects.length - 1);
    setSelectedIndex((current) => current === targetIndex ? current : targetIndex);
  };

  const finishDrag = (event, cancelled = false) => {
    const drag = dragRef.current;
    if (drag?.pointerId !== event.pointerId) return;
    const delta = cancelled ? 0 : event.clientX - drag.startX;
    const projectedOffset = cancelled ? 0 : delta + drag.velocity * 240;
    const targetIndex = clamp(drag.startIndex - Math.round(projectedOffset / drag.step), 0, projects.length - 1);
    suppressClickRef.current = Math.abs(delta) > 8 || targetIndex !== drag.startIndex;
    if (suppressClickRef.current) window.setTimeout(() => { suppressClickRef.current = false; }, 0);
    if (!cancelled) setSelectedIndex(targetIndex);
    setIsDragging(false);
    dragRef.current = null;
    if (event.currentTarget.hasPointerCapture(event.pointerId)) event.currentTarget.releasePointerCapture(event.pointerId);
  };

  return (
    <section className="project-grid cover-flow" aria-label="Project cover flow">
      <div className={`cover-flow__stage${isDragging ? " is-dragging" : ""}`} role="region" aria-roledescription="Cover flow" aria-label="Project covers. Drag horizontally to browse quickly, or use left and right arrow keys." tabIndex="0" onKeyDown={onStageKeyDown} onPointerDown={onPointerDown} onPointerMove={onPointerMove} onPointerUp={finishDrag} onPointerCancel={(event) => finishDrag(event, true)}>
        <WoodGrainField lines={woodGrainLines} />
        {projects.map((project, index) => {
          const offset = index - activeIndex;
          const distance = Math.abs(offset);
          const turn = offset === 0 ? 0 : offset > 0 ? -68 : 68;
          const horizontalOffset = Math.sign(offset) * 198 * (1 - (2 / 3) ** distance);
          const style = {
            transform: `translate(-50%, -50%) translateX(${horizontalOffset}%) translateZ(${-distance * 5.5}rem) rotateY(${turn}deg) scale(${Math.max(0.7, 1 - distance * 0.07)})`,
            zIndex: projects.length - distance,
          };

          return (
            <button
              className="cover-flow__item"
              type="button"
              key={project.title}
              aria-label={`Select ${project.title}`}
              aria-pressed={index === activeIndex}
              onClick={(event) => {
                if (suppressClickRef.current) {
                  event.preventDefault();
                  suppressClickRef.current = false;
                  return;
                }
                setSelectedIndex(index);
              }}
              style={style}
              tabIndex={distance > 3 ? -1 : 0}
            >
              <img src={project.image} alt="" draggable="false" />
              <span className="cover-flow__reflection" aria-hidden="true">
                <img src={project.image} alt="" draggable="false" />
                <WoodGrainField lines={woodGrainLines} />
              </span>
              <span className="cover-flow__item-index">{String(index + 2).padStart(2, "0")}</span>
            </button>
          );
        })}
      </div>

      <div className="cover-flow__caption" aria-live="polite">
        <p className="cover-flow__index">{String(activeIndex + 2).padStart(2, "0")} / {String(projects.length + 1).padStart(2, "0")}</p>
        <div>
          <h3 className="cover-flow__title">{activeProject.title}</h3>
          <p className="cover-flow__description">{activeProject.description}</p>
          {activeProject.linkUrl && <a className="cover-flow__open" href={activeProject.linkUrl} target="_blank" rel="noopener noreferrer">open project ↗</a>}
        </div>
        <div className="cover-flow__controls" aria-label="Project navigation">
          <button className="cover-flow__button" type="button" onClick={() => selectRelative(-1)} aria-label="Previous project" disabled={activeIndex === 0}>←</button>
          <button className="cover-flow__button" type="button" onClick={() => selectRelative(1)} aria-label="Next project" disabled={activeIndex === projects.length - 1}>→</button>
        </div>
      </div>
    </section>
  );
}

export default ProjectGrid;
