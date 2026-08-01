import { useState } from "react";

function ProjectGrid({ projects = [] }) {
  const [selectedIndex, setSelectedIndex] = useState(0);
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

  return (
    <section className="project-grid cover-flow" aria-label="Project cover flow">
      <div className="cover-flow__stage" role="region" aria-label="Project covers. Use left and right arrow keys to browse." tabIndex="0" onKeyDown={onStageKeyDown}>
        {projects.map((project, index) => {
          const offset = index - activeIndex;
          const distance = Math.abs(offset);
          const turn = offset === 0 ? 0 : offset > 0 ? -54 : 54;
          const style = {
            transform: `translate(-50%, -50%) translateX(${offset * 68}%) translateZ(${-distance * 5.5}rem) rotateY(${turn}deg) scale(${Math.max(0.58, 1 - distance * 0.11)})`,
            zIndex: projects.length - distance,
          };

          return (
            <button
              className="cover-flow__item"
              type="button"
              key={project.title}
              aria-label={`Select ${project.title}`}
              aria-pressed={index === activeIndex}
              onClick={() => setSelectedIndex(index)}
              style={style}
              tabIndex={distance > 3 ? -1 : 0}
            >
              <img src={project.image} alt="" />
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
