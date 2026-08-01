function ProjectCard({ image, title, description, linkUrl, index }) {
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

  if (!linkUrl) return <article className="project-card">{content}</article>;
  return <a className="project-card" href={linkUrl} target="_blank" rel="noopener noreferrer">{content}</a>;
}

export default ProjectCard;
