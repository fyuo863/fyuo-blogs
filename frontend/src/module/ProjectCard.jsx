import { useRef, useState, useEffect, useMemo } from "react";

function randomClip() {
  const topX = 70 + Math.random() * 25;
  const bottomX = 45 + Math.random() * 25;
  return `polygon(0 0, ${topX}% 0, ${bottomX}% 100%, 0 100%)`;
}

function randomWhiteWidth() {
  return 40 + Math.random() * 15;
}

function ProjectCard({ image, title, description, linkUrl }) {
  const cardRef = useRef(null);
  const [isWide, setIsWide] = useState(false);
  const clipPath = useMemo(() => randomClip(), []);
  const whiteWidth = useMemo(() => randomWhiteWidth(), []);

  useEffect(() => {
    const el = cardRef.current;
    if (!el) return;
    const observer = new ResizeObserver(([entry]) => {
      const { width, height } = entry.contentRect;
      setIsWide(width / height > 1.6);
    });
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const cardContent = (
    <div
      ref={cardRef}
      className="relative group overflow-hidden border border-zinc-800 h-[28vw] min-h-[260px] max-h-[420px] cursor-pointer
        transition-transform duration-300
        hover:-translate-y-3 hover:duration-200 hover:ease-out"
      style={{
        transitionTimingFunction: "cubic-bezier(0.34, 1.56, 0.64, 1)",
      }}
    >
      {isWide ? (
        <>
          <img
            src={image}
            alt={title}
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div
            className="relative h-full bg-white flex flex-col justify-center px-6"
            style={{ width: `${whiteWidth}%`, clipPath }}
          >
            <h3 className="text-3xl font-extrabold tracking-tight text-black text-left">
              {title}
            </h3>
            {description && (
              <p className="mt-2 text-zinc-600 text-sm leading-relaxed line-clamp-3">
                {description}
              </p>
            )}
          </div>
        </>
      ) : (
        <>
          <div className="h-2/3 overflow-hidden relative">
            <img
              src={image}
              alt={title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
          </div>
          <div className="h-1/3 bg-white px-6 flex flex-col justify-center">
            {description && (
              <p className="text-zinc-600 text-sm leading-relaxed line-clamp-2">
                {description}
              </p>
            )}
          </div>
          <h3
            className="absolute left-6 bottom-1/3 translate-y-1/2 text-4xl italic font-extrabold tracking-tight text-black pointer-events-none select-none"
            style={{
              WebkitTextStroke: "10px white",
              paintOrder: "stroke fill",
            }}
          >
            {title}
          </h3>
        </>
      )}
    </div>
  );

  if (linkUrl) {
    return (
      <a
        href={linkUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="block"
      >
        {cardContent}
      </a>
    );
  }

  return cardContent;
}

export default ProjectCard;
