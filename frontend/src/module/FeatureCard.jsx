import { useRef, useState, useEffect } from "react";
import GithubIcon from "./GithubIcon";

function FeatureCard({ image, title, githubUrl, description, linkUrl }) {
  const cardRef = useRef(null);
  const [isWide, setIsWide] = useState(false);

  useEffect(() => {
    const el = cardRef.current;
    if (!el) return;
    const observer = new ResizeObserver(([entry]) => {
      setIsWide(entry.contentRect.width > 640);
    });
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const cardContent = (
    <div ref={cardRef}>
      {isWide ? (
        <div className="flex flex-row items-center gap-8">
          <div className="w-[45%] shrink-0 overflow-hidden border border-zinc-800">
            <img
              src={image}
              alt={title}
              className="w-full h-auto object-cover"
            />
          </div>
          <div className="flex-1">
            <h2 className="text-4xl font-extrabold tracking-tighter text-white">
              {title}
            </h2>
            {githubUrl && (
              <a
                href={githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                className="inline-block text-zinc-500 hover:text-white mt-4 transition-colors"
              >
                <GithubIcon size={24} />
              </a>
            )}
            {description && (
              <p className="text-zinc-400 text-base leading-relaxed mt-4">
                {description}
              </p>
            )}
          </div>
        </div>
      ) : (
        <div className="flex flex-col items-center">
          <div className="w-full overflow-hidden border border-zinc-800">
            <img
              src={image}
              alt={title}
              className="w-full h-auto object-cover"
            />
          </div>
          <div className="w-full">
            <h2 className="text-4xl font-extrabold tracking-tighter text-white mt-8">
              {title}
            </h2>
            {githubUrl && (
              <a
                href={githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                className="inline-block text-zinc-500 hover:text-white mt-4 transition-colors"
              >
                <GithubIcon size={24} />
              </a>
            )}
            {description && (
              <p className="text-zinc-400 text-base leading-relaxed mt-4">
                {description}
              </p>
            )}
          </div>
        </div>
      )}
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

export default FeatureCard;
