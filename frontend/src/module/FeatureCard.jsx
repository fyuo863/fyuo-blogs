import GithubIcon from "./GithubIcon";

function FeatureCard({ image, title, githubUrl, description, linkUrl }) {
  const content = (
    <article className="feature-card">
      <div className="feature-card__image"><img src={image} alt={title} /></div>
      <div className="feature-card__content">
        <p className="feature-card__label">cover story / 01</p>
        <h2 className="feature-card__title">{title}</h2>
        {description && <p className="feature-card__description">{description}</p>}
        {githubUrl && <a className="feature-card__source" href={githubUrl} target="_blank" rel="noopener noreferrer" aria-label={`${title} on GitHub`} onClick={(event) => event.stopPropagation()}><GithubIcon size={21} /></a>}
      </div>
    </article>
  );

  if (!linkUrl) return content;
  return <a href={linkUrl} target="_blank" rel="noopener noreferrer">{content}</a>;
}

export default FeatureCard;
