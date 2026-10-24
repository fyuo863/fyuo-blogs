import GithubIcon from "./GithubIcon";

function FeatureCard({ image, title, githubUrl, description, linkUrl }) {
  const content = (
    <article className="feature-card">
      <div className="feature-card__image">{image && <img key={image} src={image} alt={title} onError={event => { event.currentTarget.hidden=true; event.currentTarget.nextElementSibling.hidden=false; }} />}<span hidden={Boolean(image)}>{title}</span></div>
      <div className="feature-card__content">
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
