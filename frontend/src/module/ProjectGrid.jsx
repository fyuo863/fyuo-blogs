import ProjectCard from "./ProjectCard";

function ProjectGrid({ projects = [] }) {
  if (!projects.length) return null;
  return <div className="project-grid">{projects.map((project, index) => <ProjectCard key={project.title} {...project} index={index + 2} />)}</div>;
}

export default ProjectGrid;
