import { useState, useRef, useEffect, useCallback } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import parseBlocks from "../utils/parseBlocks";
import Callout from "./Callout";

// ── 工具 ──
function parseFrontmatter(raw) {
  const lines = raw.split("\n").slice(1, -1);
  const props = {};
  for (const line of lines) {
    const idx = line.indexOf(":");
    if (idx === -1) continue;
    props[line.slice(0, idx).trim()] = line.slice(idx + 1).trim();
  }
  return props;
}

function FrontmatterCard({ raw }) {
  const props = parseFrontmatter(raw);
  const keys = Object.keys(props);
  if (!keys.length) return null;
  return (
    <div className="rounded-lg border border-zinc-800 bg-white/[0.02] px-5 py-4 font-mono text-sm">
      {keys.map((k) => (
        <div key={k} className="flex gap-4 py-0.5">
          <span className="text-zinc-500 shrink-0">{k}</span>
          <span className="text-zinc-300">{props[k]}</span>
        </div>
      ))}
    </div>
  );
}

const inlineAllowed = [
  "strong", "em", "del", "a", "code", "img", "br", "sub", "sup",
];

function InlineMarkdown({ children }) {
  return (
    <ReactMarkdown
      remarkPlugins={[remarkGfm]}
      allowedElements={inlineAllowed}
      unwrapDisallowed
    >
      {children}
    </ReactMarkdown>
  );
}

const CALLOUT_RE = /^\[!(\w+)\]\s*(.*)/;
function parseCalloutMeta(firstLine) {
  const text = firstLine.replace(/^>\s*/, "");
  const match = text.match(CALLOUT_RE);
  if (!match) return { type: "note", title: "Note" };
  const t = match[1].toLowerCase();
  return {
    type: t,
    title: match[2] || t.charAt(0).toUpperCase() + t.slice(1),
  };
}

// ── 查看态 ──
function BlockView({ block }) {
  const { type, content } = block;

  switch (type) {
    case "frontmatter":
      return <FrontmatterCard raw={content} />;

    case "heading": {
      const level = content.match(/^#+/)?.[0]?.length || 1;
      const text = content.replace(/^#+\s*/, "");
      const sizes = {
        1: "text-3xl font-extrabold",
        2: "text-2xl font-bold",
        3: "text-xl font-semibold",
        4: "text-lg font-semibold",
        5: "text-base font-semibold",
        6: "text-sm font-semibold",
      };
      return (
        <div className={`${sizes[level] || sizes[1]} text-white leading-snug`}>
          <InlineMarkdown>{text}</InlineMarkdown>
        </div>
      );
    }

    case "paragraph":
      return (
        <div className="text-zinc-300 leading-relaxed">
          <InlineMarkdown>{content}</InlineMarkdown>
        </div>
      );

    case "fenced-code": {
      const lang = content.split("\n")[0].replace(/```\s*/, "");
      const code = content.split("\n").slice(1, -1).join("\n");
      return (
        <pre className="bg-white/5 border border-zinc-800 rounded-lg p-5 overflow-x-auto">
          {lang && (
            <div className="text-xs text-zinc-500 mb-2 uppercase tracking-wider">
              {lang}
            </div>
          )}
          <code className="text-sm text-zinc-300 font-mono leading-relaxed whitespace-pre">
            {code}
          </code>
        </pre>
      );
    }

    case "table":
      return (
        <div className="overflow-x-auto [&_table]:w-full [&_table]:border-collapse [&_th]:border [&_th]:border-zinc-700 [&_th]:px-4 [&_th]:py-2 [&_th]:text-left [&_th]:text-sm [&_th]:font-semibold [&_th]:text-white [&_th]:bg-white/[0.04] [&_td]:border [&_td]:border-zinc-800 [&_td]:px-4 [&_td]:py-2 [&_td]:text-sm [&_td]:text-zinc-300 [&_tr:nth-child(even)]:bg-white/[0.02]">
          <ReactMarkdown remarkPlugins={[remarkGfm]}>
            {content}
          </ReactMarkdown>
        </div>
      );

    case "callout": {
      const lines = content.split("\n");
      const meta = parseCalloutMeta(lines[0]);
      const inner = [
        lines[0].replace(/^>\s*\[!\w+\]\s*/, ""),
        ...lines.slice(1).map((l) => l.replace(/^>\s?/, "")),
      ].join("\n");
      return (
        <Callout type={meta.type} title={meta.title}>
          <ReactMarkdown remarkPlugins={[remarkGfm]}>
            {inner}
          </ReactMarkdown>
        </Callout>
      );
    }

    case "blockquote":
      return (
        <blockquote className="border-l-2 border-zinc-600 pl-4 italic text-zinc-400 leading-relaxed">
          <InlineMarkdown>
            {content.split("\n").map((l) => l.replace(/^>\s?/, "")).join("\n")}
          </InlineMarkdown>
        </blockquote>
      );

    case "list":
      return (
        <div className="text-zinc-300 leading-relaxed">
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            allowedElements={[
              "ul", "ol", "li",
              "strong", "em", "del", "a", "code", "img", "br", "sub", "sup",
            ]}
          >
            {content}
          </ReactMarkdown>
        </div>
      );

    case "thematic-break":
      return <hr className="border-zinc-800 my-2" />;

    default:
      return (
        <div className="text-zinc-300 leading-relaxed">
          <InlineMarkdown>{content}</InlineMarkdown>
        </div>
      );
  }
}

// ── 单块编辑态：无边框 textarea ──
function BlockEdit({ block, onBlur }) {
  const taRef = useRef(null);
  const [value, setValue] = useState(block.content);

  useEffect(() => {
    const ta = taRef.current;
    if (!ta) return;
    ta.style.height = "auto";
    ta.style.height = ta.scrollHeight + "px";
    ta.focus();
    ta.setSelectionRange(ta.value.length, ta.value.length);
  }, []);

  const handleKeyDown = (e) => {
    if (e.key === "Escape") {
      e.preventDefault();
      setValue(block.content);
      e.currentTarget.blur();
    }
    // Ctrl+A 默认行为选中 textarea 内全部文本
  };

  return (
    <textarea
      ref={taRef}
      value={value}
      onChange={(e) => setValue(e.target.value)}
      onBlur={() => onBlur(value)}
      onKeyDown={handleKeyDown}
      className="w-full resize-none bg-transparent text-zinc-300 leading-relaxed
                 focus:outline-none border-none"
      style={{ fontFamily: "inherit", fontSize: "inherit" }}
    />
  );
}

// ── 主组件 ──
export default function MarkdownEditor({ value, onChange, editorRef }) {
  const [blocks, setBlocks] = useState(() => parseBlocks(value));
  const [focusedId, setFocusedId] = useState(null);
  const containerRef = useRef(null);

  const rebuild = useCallback((bs) => bs.map((b) => b.content).join("\n\n"), []);

  const getContent = useCallback(() => rebuild(blocks), [blocks, rebuild]);

  useEffect(() => {
    if (editorRef) editorRef.current = { getContent };
  }, [editorRef, getContent]);

  useEffect(() => {
    setBlocks(parseBlocks(value));
  }, [value]);

  // 容器级 Ctrl+A：在原位选中全部渲染文本
  const handleContainerKeyDown = (e) => {
    if (e.key === "a" && (e.ctrlKey || e.metaKey)) {
      e.preventDefault();
      const range = document.createRange();
      range.selectNodeContents(containerRef.current);
      const sel = window.getSelection();
      sel.removeAllRanges();
      sel.addRange(range);
    }
  };

  // Ctrl+C：替换为 markdown 原文
  const handleCopy = (e) => {
    e.preventDefault();
    const raw = rebuild(blocks);
    e.clipboardData.setData("text/plain", raw);
  };

  const handleBlockBlur = (id, newContent) => {
    setFocusedId(null);
    if (newContent === undefined || newContent.trim() === "") {
      setBlocks((prev) => prev.filter((b) => b.id !== id));
      return;
    }
    setBlocks((prev) => {
      const firstLine = newContent.trimStart().split("\n")[0];
      let newType = "paragraph";
      if (/^#{1,6}\s/.test(firstLine)) newType = "heading";
      else if (firstLine.startsWith("```")) newType = "fenced-code";
      else if (/^\|.+\|/.test(firstLine)) newType = "table";
      else if (/^> \[!\w+\]/.test(firstLine)) newType = "callout";
      else if (/^>\s/.test(firstLine)) newType = "blockquote";
      else if (/^(\s*)([-*+]|\d+[.)])\s/.test(firstLine)) newType = "list";
      else if (/^(-{3,}|\*{3,}|_{3,})\s*$/.test(firstLine))
        newType = "thematic-break";

      const updated = prev.map((b) =>
        b.id === id ? { ...b, content: newContent, type: newType } : b
      );
      if (onChange) onChange(rebuild(updated));
      return updated;
    });
  };

  return (
    <div
      ref={containerRef}
      tabIndex={0}
      onKeyDown={handleContainerKeyDown}
      className="flex flex-col gap-4 focus:outline-none"
      onCopy={handleCopy}
    >
      {blocks.map((block) => {
        const isFocused = focusedId === block.id;
        return (
          <div
            key={block.id}
            onClick={() => {
              if (!isFocused) setFocusedId(block.id);
            }}
            className="cursor-text group"
          >
            {isFocused ? (
              <BlockEdit
                block={block}
                onBlur={(v) => handleBlockBlur(block.id, v)}
              />
            ) : (
              <BlockView block={block} />
            )}
          </div>
        );
      })}

      {/* 点击空白新增段落 */}
      <div
        className="h-8 cursor-text rounded hover:bg-white/[0.02] transition-colors"
        onClick={() => {
          const id = String(Date.now());
          setBlocks((prev) => [
            ...prev,
            { id, type: "paragraph", content: "" },
          ]);
          setTimeout(() => setFocusedId(id), 0);
        }}
      />
    </div>
  );
}
