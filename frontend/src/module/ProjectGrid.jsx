import { useRef, useState } from "react";

const clamp = (value, minimum, maximum) => Math.min(Math.max(value, minimum), maximum);

const createMoireLine = (lineIndex, phase) => {
  const baseline = lineIndex * 17 - 153;
  const points = [];

  for (let x = -120; x <= 1320; x += 24) {
    const warp = Math.sin(x * 0.014 + phase) * 32
      + Math.sin(baseline * 0.28 + x * 0.009 + phase) * 20
      + Math.cos(baseline * 0.11 - x * 0.005 - phase) * 6;
    points.push(`${x === -120 ? "M" : "L"} ${x} ${baseline + warp}`);
  }

  return points.join(" ");
};

const cobaltMoireLines = Array.from({ length: 78 }, (_, index) => createMoireLine(index, 0));
const vermilionMoireLines = Array.from({ length: 78 }, (_, index) => createMoireLine(index, 0.62));

function MoireField({ className = "cover-flow__moire" }) {
  return (
    <svg className={className} viewBox="0 0 1200 900" preserveAspectRatio="none" aria-hidden="true" focusable="false">
      <g className="cover-flow__moire-layer cover-flow__moire-layer--cobalt">
        {cobaltMoireLines.map((path, index) => <path d={path} key={`cobalt-${index}`} />)}
      </g>
      <g className="cover-flow__moire-layer cover-flow__moire-layer--vermilion" transform="rotate(1.2 600 450)">
        {vermilionMoireLines.map((path, index) => <path d={path} key={`vermilion-${index}`} />)}
      </g>
    </svg>
  );
}

function ProjectGrid({ projects = [] }) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
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
        <MoireField />
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
                <MoireField />
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
