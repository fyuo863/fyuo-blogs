// 文件路径: src/pages/Callout.jsx
import React from "react";

export default function Callout({ type = "note", title, children }) {
  // 根据不同的 type 渲染不同的 Tailwind 颜色主题
  const theme = {
    note: "border-blue-500 bg-blue-500/10 text-blue-200",
    info: "border-emerald-500 bg-emerald-500/10 text-emerald-200",
    warning: "border-amber-500 bg-amber-500/10 text-amber-200",
    danger: "border-red-500 bg-red-500/10 text-red-200",
  };

  const style = theme[type] || theme.note;

  return (
    <div className={`my-4 rounded-r-lg border-l-4 p-4 ${style}`}>
      {title && (
        <div className="mb-2 font-bold flex items-center gap-2">
          <span>{title}</span>
        </div>
      )}
      <div className="text-sm leading-relaxed opacity-90 [&>p]:m-0">
        {children}
      </div>
    </div>
  );
}
