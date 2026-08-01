import ProjectCard from "./ProjectCard";

function ProjectGrid({ projects = [] }) {
  if (!projects.length) return null;
  const spreads = projects.reduce((pages, project, index) => {
    if (index % 2 === 0) pages.push([project]);
    else pages[pages.length - 1].push(project);
    return pages;
  }, []);

  return (
    <div className="project-grid">
      {spreads.map((spread, spreadIndex) => (
        <div className={`project-spread${spread.length === 1 ? " project-spread--solo" : ""}`} key={spread[0].title}>
          {spread.map((project, pageIndex) => (
            <ProjectCard
              key={project.title}
              {...project}
              index={spreadIndex * 2 + pageIndex + 2}
              page={pageIndex === 0 ? "recto" : "verso"}
            />
          ))}
        </div>
      ))}
    </div>
  );
}

export default ProjectGrid;
