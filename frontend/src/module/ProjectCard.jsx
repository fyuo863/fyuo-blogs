import { useRef, useState, useEffect, useMemo } from "react";

function randomClip() {
  const topX = 75 + Math.random() * 20;
  const bottomX = 65 + Math.random() * 20;
  return {
    path: `polygon(0 0, ${topX}% 0, ${bottomX}% 100%, 0 100%)`,
    bottomX,
  };
}

function randomWhiteWidth() {
  return 55 + Math.random() * 15;
}

function ProjectCard({ image, title, description, linkUrl }) {
  const cardRef = useRef(null);
  const [isWide, setIsWide] = useState(false);
  const clip = useMemo(() => randomClip(), []);
  const whiteWidth = useMemo(() => randomWhiteWidth(), []);

  const safePr = ((100 - clip.bottomX) * whiteWidth / 100).toFixed(1);

  useEffect(() => {
    const el = cardRef.current;
    if (!el) return;
    const observer = new ResizeObserver(([entry]) => {
      setIsWide(entry.contentRect.width > 400);
    });
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const cardContent = (
    <div
      ref={cardRef}
      className="relative group overflow-hidden border border-zinc-800 cursor-pointer
        transition-transform duration-300
        hover:-translate-y-3 hover:duration-200 hover:ease-out"
      style={{
        transitionTimingFunction: "cubic-bezier(0.34, 1.56, 0.64, 1)",
      }}
    >
      {isWide ? (
        <div className="relative h-56">
          <img
            src={image}
            alt={title}
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-transparent" />
          <div
            className="relative h-full bg-white flex flex-col justify-center px-6"
            style={{ width: `${whiteWidth}%`, clipPath: clip.path, paddingRight: `${safePr}%` }}
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
        </div>
      ) : (
        <>
          <div className="h-52 overflow-hidden relative">
            <img
              src={image}
              alt={title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
          </div>
          <div className="bg-white px-6 pt-10 pb-6">
            {description && (
              <p className="text-zinc-600 text-sm leading-relaxed line-clamp-2">
                {description}
              </p>
            )}
          </div>
          <h3
            className="absolute left-6 text-4xl italic font-extrabold tracking-tight text-black pointer-events-none select-none"
            style={{
              top: "13rem",
              transform: "translateY(-50%)",
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
