import GithubIcon from "./GithubIcon";

function FeatureCard({ image, title, githubUrl, description }) {
  return (
    <div className="flex flex-col items-center">
      <div className="w-full max-w-3xl overflow-hidden border border-zinc-800">
        <img
          src={image}
          alt={title}
          className="w-full h-auto object-cover"
        />
      </div>

      <div className="w-full max-w-3xl">
        <h2 className="text-4xl font-extrabold tracking-tighter text-white mt-8">
          {title}
        </h2>

        {githubUrl && (
          <a
            href={githubUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block text-zinc-500 hover:text-white mt-4 transition-colors"
          >
            <GithubIcon size={24} />
          </a>
        )}

        {description && (
          <p className="text-zinc-400 text-base leading-relaxed mt-4 max-w-2xl">
            {description}
          </p>
        )}
      </div>
    </div>
  );
}

export default FeatureCard;
