import { useMemo } from "react";
import ProjectCard from "./ProjectCard";

function randomFirstWidth() {
  return 35 + Math.random() * 30;
}

function ProjectGrid({ title, projects = [] }) {
  const rows = useMemo(() => {
    const result = [];
    for (let i = 0; i < projects.length; i += 2) {
      result.push({
        pair: projects.slice(i, i + 2),
        firstWidth: randomFirstWidth(),
      });
    }
    return result;
  }, [projects]);

  if (!projects.length) return null;

  return (
    <div className="flex flex-col gap-6">
      {title && (
        <h2 className="text-3xl font-extrabold tracking-tighter text-white text-left">
          {title}
        </h2>
      )}
      {rows.map((row, ri) => (
        <div key={ri} className="flex flex-col md:flex-row gap-6">
          <div style={{ flexBasis: `${row.firstWidth}%`, flexShrink: 0 }}>
            <ProjectCard
              image={row.pair[0].image}
              title={row.pair[0].title}
              description={row.pair[0].description}
              linkUrl={row.pair[0].linkUrl}
            />
          </div>
          {row.pair[1] && (
            <div className="flex-1 min-w-0">
              <ProjectCard
                image={row.pair[1].image}
                title={row.pair[1].title}
                description={row.pair[1].description}
                linkUrl={row.pair[1].linkUrl}
              />
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

export default ProjectGrid;
