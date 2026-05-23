const VARIANTS = {
  note:      { border: "border-l-blue-500",   bg: "bg-blue-500/5",   text: "text-blue-400" },
  tip:       { border: "border-l-teal-500",    bg: "bg-teal-500/5",    text: "text-teal-400" },
  info:      { border: "border-l-cyan-500",    bg: "bg-cyan-500/5",    text: "text-cyan-400" },
  warning:   { border: "border-l-amber-500",   bg: "bg-amber-500/5",   text: "text-amber-400" },
  danger:    { border: "border-l-red-500",     bg: "bg-red-500/10",    text: "text-red-400" },
  example:   { border: "border-l-purple-500",  bg: "bg-purple-500/5",  text: "text-purple-400" },
  abstract:  { border: "border-l-teal-500",    bg: "bg-teal-500/5",    text: "text-teal-400" },
  todo:      { border: "border-l-sky-500",     bg: "bg-sky-500/5",     text: "text-sky-400" },
  success:   { border: "border-l-green-500",   bg: "bg-green-500/5",   text: "text-green-400" },
  question:  { border: "border-l-yellow-500",  bg: "bg-yellow-500/5",  text: "text-yellow-400" },
  failure:   { border: "border-l-red-500",     bg: "bg-red-500/10",    text: "text-red-400" },
  bug:       { border: "border-l-red-500",     bg: "bg-red-500/10",    text: "text-red-400" },
  quote:     { border: "border-l-zinc-500",    bg: "bg-zinc-500/5",    text: "text-zinc-400" },
};

const LABELS = {
  note: "Note", tip: "Tip", info: "Info", warning: "Warning",
  danger: "Danger", example: "Example", abstract: "Abstract",
  todo: "Todo", success: "Success", question: "Question",
  failure: "Failure", bug: "Bug", quote: "Quote",
};

export default function Callout({ type, title, children }) {
  const v = VARIANTS[type] || VARIANTS.note;
  const label = LABELS[type] || type;

  return (
    <div
      className={`my-6 border-l-4 ${v.border} ${v.bg} rounded-r-lg px-5 py-4`}
    >
      <div className={`text-sm font-bold tracking-wide uppercase mb-2 ${v.text}`}>
        {title || label}
      </div>
      <div className="text-zinc-300 leading-relaxed">{children}</div>
    </div>
  );
}
