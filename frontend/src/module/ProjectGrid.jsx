import ProjectCard from "./ProjectCard";

function ProjectGrid({ projects = [] }) {
  if (!projects.length) return null;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
      {projects.map((project, i) => (
        <ProjectCard
          key={i}
          image={project.image}
          title={project.title}
          githubUrl={project.githubUrl}
          description={project.description}
        />
      ))}
    </div>
  );
}

export default ProjectGrid;
