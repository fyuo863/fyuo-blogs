function ProjectCard({ image, title, description, linkUrl }) {
  const cardContent = (
    <div
      className="relative group overflow-hidden border border-zinc-800 h-80 cursor-pointer
        transition-transform duration-300
        hover:-translate-y-3 hover:duration-200 hover:ease-out"
      style={{
        transitionTimingFunction: "cubic-bezier(0.34, 1.56, 0.64, 1)",
      }}
    >
      {/* 上半部分：图片（占 2/3 高度）+ 边缘黑色渐变 */}
      <div className="h-2/3 overflow-hidden relative">
        <img
          src={image}
          alt={title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
      </div>

      {/* 下半部分：白色区域（占 1/3 高度） */}
      <div className="h-1/3 bg-white px-6 flex flex-col justify-center">
        {description && (
          <p className="text-zinc-600 text-xs leading-relaxed line-clamp-2">
            {description}
          </p>
        )}
      </div>

      {/* 标题：横跨图片与白色区域的分界线，黑色文字 + 白色描边 */}
      <h3
        className="absolute left-6 bottom-1/3 translate-y-1/2 text-4xl italic font-extrabold tracking-tight text-black pointer-events-none select-none"
        style={{
          WebkitTextStroke: "10px white",
          paintOrder: "stroke fill",
        }}
      >
        {title}
      </h3>
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
