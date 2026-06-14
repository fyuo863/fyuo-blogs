import { useState, useRef, useEffect, useCallback, useMemo } from "react";
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

// ── 主组件 ──
export default function MarkdownEditor({
  value,
  onChange,
  editorRef,
  editing,
  onUploadImage,
}) {
  const [fullEdit, setFullEdit] = useState(false);
  const [fullText, setFullText] = useState("");
  const [editText, setEditText] = useState(value);
  const [uploading, setUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const dragDepthRef = useRef(0);
  const containerRef = useRef(null);
  const fullTaRef = useRef(null);
  const editorAreaRef = useRef(null);

  const sourceText = fullEdit ? fullText : editing ? editText : value;
  const blocks = useMemo(() => parseBlocks(sourceText), [sourceText]);
  const rebuild = useCallback((bs) => bs.map((b) => b.content).join("\n\n"), []);
  const getContent = useCallback(
    () => (editing ? editText : rebuild(blocks)),
    [blocks, editText, editing, rebuild]
  );

  useEffect(() => {
    if (editorRef) editorRef.current = { getContent };
  }, [editorRef, getContent]);

  useEffect(() => {
    if (!editing) return undefined;

    const preventWindowDrop = (event) => {
      const hasFiles = Array.from(event.dataTransfer?.types || []).includes("Files");
      if (!hasFiles) return;
      event.preventDefault();
    };

    window.addEventListener("dragover", preventWindowDrop);
    window.addEventListener("drop", preventWindowDrop);
    return () => {
      window.removeEventListener("dragover", preventWindowDrop);
      window.removeEventListener("drop", preventWindowDrop);
    };
  }, [editing]);

  // Auto-resize fullEdit textarea
  useEffect(() => {
    const ta = fullTaRef.current;
    if (ta && fullEdit) {
      ta.style.height = "auto";
      ta.style.height = ta.scrollHeight + "px";
    }
  }, [fullText, fullEdit]);

  // Focus + cursor at end when entering fullEdit
  useEffect(() => {
    if (fullEdit && fullTaRef.current) {
      const ta = fullTaRef.current;
      ta.focus();
      ta.setSelectionRange(ta.value.length, ta.value.length);
    }
  }, [fullEdit]);

  const commitFullEdit = (text) => {
    setEditText(text);
    setFullEdit(false);
    if (onChange) onChange(text);
  };

  // ── 查看态：纯渲染 ──
  if (!editing) {
    return (
      <div
        ref={containerRef}
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === "a" && (e.ctrlKey || e.metaKey)) {
            e.preventDefault();
            const range = document.createRange();
            range.selectNodeContents(containerRef.current);
            const sel = window.getSelection();
            sel.removeAllRanges();
            sel.addRange(range);
          }
        }}
        className="flex flex-col gap-4 focus:outline-none"
        onCopy={(e) => {
          e.preventDefault();
          e.clipboardData.setData("text/plain", rebuild(blocks));
        }}
      >
        {blocks.map((block) => (
          <BlockView key={block.id} block={block} />
        ))}
      </div>
    );
  }

  // ── 全文编辑态（旧，保留兼容） ──
  if (fullEdit) {
    return (
      <textarea
        ref={fullTaRef}
        value={fullText}
        onChange={(e) => setFullText(e.target.value)}
        onBlur={(e) => commitFullEdit(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Escape") {
            e.preventDefault();
            commitFullEdit(value);
          }
        }}
        className="w-full min-h-[60vh] resize-none bg-transparent
                   text-zinc-300 leading-relaxed
                   focus:outline-none border-none"
        style={{ fontFamily: "inherit", fontSize: "inherit" }}
      />
    );
  }

  // ── 编辑态：左侧渲染预览 + 右侧编辑框 ──
  const handleEditChange = (text) => {
    setEditText(text);
    if (onChange) onChange(text);
  };

  const handleImageUpload = async (event) => {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;
    await insertUploadedImage(file);
  };

  const insertUploadedImage = async (file) => {
    if (!file || !onUploadImage) return;
    setUploading(true);
    try {
      const url = await onUploadImage(file);
      if (!url) return;
      const textarea = editorAreaRef.current;
      const insertion = `\n![${file.name}](${url})\n`;
      if (!textarea) {
        handleEditChange(`${editText}${insertion}`);
        return;
      }
      const start = textarea.selectionStart ?? textarea.value.length;
      const end = textarea.selectionEnd ?? textarea.value.length;
      const next = `${editText.slice(0, start)}${insertion}${editText.slice(end)}`;
      handleEditChange(next);
      requestAnimationFrame(() => {
        textarea.focus();
        const cursor = start + insertion.length;
        textarea.setSelectionRange(cursor, cursor);
      });
    } finally {
      setUploading(false);
    }
  };

  const handleDragEnter = (event) => {
    event.preventDefault();
    event.stopPropagation();
    dragDepthRef.current += 1;
    if (event.dataTransfer?.types?.includes("Files")) {
      setDragActive(true);
    }
  };

  const handleDragOver = (event) => {
    event.preventDefault();
    event.stopPropagation();
    if (event.dataTransfer) {
      event.dataTransfer.dropEffect = "copy";
    }
  };

  const handleDragLeave = (event) => {
    event.preventDefault();
    event.stopPropagation();
    dragDepthRef.current = Math.max(0, dragDepthRef.current - 1);
    if (dragDepthRef.current === 0) {
      setDragActive(false);
    }
  };

  const handleDrop = async (event) => {
    event.preventDefault();
    event.stopPropagation();
    dragDepthRef.current = 0;
    setDragActive(false);
    const file = Array.from(event.dataTransfer?.files || []).find((item) =>
      item.type.startsWith("image/")
    );
    if (!file) return;
    await insertUploadedImage(file);
  };

  return (
    <div
      className={`relative flex gap-6 ${dragActive ? "ring-1 ring-white/40" : ""}`}
      style={{ minHeight: "60vh" }}
      onDragEnter={handleDragEnter}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      {dragActive ? (
        <div className="pointer-events-none absolute inset-0 z-20 flex items-center justify-center border border-dashed border-white/30 bg-black/70 text-sm font-mono uppercase tracking-[0.28em] text-white">
          drop image to upload
        </div>
      ) : null}
      {/* 左侧：渲染预览 */}
      <div className="flex-1 min-w-0 border-r border-zinc-800 pr-6">
        <div className="text-xs text-zinc-600 uppercase tracking-wider mb-4">
          Preview
        </div>
        <div
          className="flex flex-col gap-4"
          onCopy={(e) => {
            e.preventDefault();
            e.clipboardData.setData("text/plain", editText);
          }}
        >
          {blocks.map((block) => (
            <BlockView key={block.id} block={block} />
          ))}
        </div>
      </div>

      {/* 右侧：编辑框（sticky 跟随滚动） */}
      <div className="flex-1 min-w-0 pl-6">
        <div className="sticky top-0 z-10 bg-black pb-4">
          <div className="mb-4 flex items-center justify-between gap-3">
            <div className="text-xs text-zinc-600 uppercase tracking-wider">
              Editor
            </div>
            <label className="cursor-pointer border border-zinc-800 px-3 py-2 text-xs font-mono text-zinc-300 transition-colors hover:border-zinc-600 hover:text-white">
              {uploading ? "uploading..." : "insert image"}
              <input
                type="file"
                accept="image/png,image/jpeg,image/jpg,image/gif,image/webp"
                className="hidden"
                onChange={handleImageUpload}
                disabled={uploading}
              />
            </label>
          </div>
          <textarea
            ref={editorAreaRef}
            value={editText}
            onChange={(e) => handleEditChange(e.target.value)}
            className="w-full resize-none bg-transparent
                       text-zinc-300 leading-relaxed font-mono text-sm
                       focus:outline-none border-none"
            style={{ fontFamily: "inherit", height: "calc(100vh - 4rem)" }}
            placeholder="Write your markdown here..."
          />
        </div>
      </div>
    </div>
  );
}
