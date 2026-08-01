function ProjectCard({ image, title, description, linkUrl, index, page }) {
  const content = (
    <>
      <div className="project-card__image">
        <img src={image} alt={title} />
        <span className="project-card__index">{String(index).padStart(2, "0")}</span>
      </div>
      <div className="project-card__content">
        <h3 className="project-card__title">{title}</h3>
        {description && <p className="project-card__description">{description}</p>}
      </div>
    </>
  );

  const className = `project-card project-card--${page}`;
  if (!linkUrl) return <article className={className}>{content}</article>;
  return <a className={className} href={linkUrl} target="_blank" rel="noopener noreferrer">{content}</a>;
}

export default ProjectCard;
