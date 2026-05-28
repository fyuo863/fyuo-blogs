import GithubIcon from "./GithubIcon";

function ProjectCard({ image, title, githubUrl, description, linkUrl }) {
  const cardContent = (
    <div className="relative group overflow-hidden border border-zinc-800">
      <img
        src={image}
        alt={title}
        className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-500"
      />

      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent flex flex-col items-center justify-end p-6">
        <h3 className="text-xl font-bold tracking-tight text-white text-center">
          {title}
        </h3>

        {githubUrl && (
          <a
            href={githubUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            className="text-zinc-400 hover:text-white mt-2 transition-colors"
          >
            <GithubIcon size={18} />
          </a>
        )}

        {description && (
          <p className="text-zinc-300 text-sm leading-relaxed mt-2 text-center max-w-xs">
            {description}
          </p>
        )}
      </div>
    </div>
  );

  if (linkUrl) {
    return (
      <a
        href={linkUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="block cursor-pointer"
      >
        {cardContent}
      </a>
    );
  }

  return cardContent;
}

export default ProjectCard;
