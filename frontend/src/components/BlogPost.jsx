import { useState, useRef, useEffect, useLayoutEffect } from "react";
import MarkdownEditor from "./MarkdownEditor";

function formatDate(iso) {
  const d = new Date(iso);
  const date = d.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
  const time = d.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
  return `${date} ${time}`.toUpperCase();
}

function formatAuthor(post) {
  const name = post?.publisher_name?.trim() || post?.author?.name?.trim();
  if (!name) return "by unknown";
  return `by ${name}`;
}

export default function BlogPost({ post, isEditing, editRef, onBack }) {
  const [editTitle, setEditTitle] = useState(post.title);
  const [editTags, setEditTags] = useState((post.tags || []).join(", "));
  const editorRef = useRef(null);
  const titleRef = useRef(null);

  useLayoutEffect(() => {
    const ta = titleRef.current;
    if (ta) {
      ta.style.height = "auto";
      ta.style.height = ta.scrollHeight + "px";
    }
  }, [editTitle, isEditing]);

  useEffect(() => {
    if (editRef) {
      editRef.current = {
        getContent: () => editorRef.current?.getContent() ?? post.content,
        getTitle: () => editTitle,
        getTags: () => editTags.split(",").map((t) => t.trim()).filter(Boolean),
      };
    }
  }, [editRef, post.content, editTitle, editTags]);

  return (
    <div className="fixed inset-0 z-50 bg-black overflow-y-auto">
      <div className="px-[10%] py-16">
        <button
          onClick={onBack}
          className="text-lg font-mono text-white hover:text-white transition-colors mb-16"
        >
          back.
        </button>

        <div className="ml-10 flex flex-wrap items-center gap-x-4 gap-y-2">
          <time className="font-mono text-sm tracking-widest text-zinc-500 uppercase">
            {formatDate(post.created_at)}
          </time>
          <div className="text-xs font-mono tracking-[0.28em] text-zinc-600 uppercase">
            {formatAuthor(post)}
          </div>
        </div>

        {isEditing ? (
          <textarea
            ref={titleRef}
            value={editTitle}
            onChange={(e) => setEditTitle(e.target.value)}
            rows={1}
            className="mt-4 w-full text-3xl font-bold tracking-tight text-white sm:text-4xl
                       bg-transparent border-none focus:outline-none resize-none
                       overflow-hidden placeholder:text-zinc-600"
            placeholder="Article title..."
          />
        ) : (
          <h1 className="mt-4 text-3xl font-bold tracking-tight text-white sm:text-4xl">
            {post.title}
          </h1>
        )}

        {isEditing ? (
          <div className="mt-6">
            <input
              value={editTags}
              onChange={(e) => setEditTags(e.target.value)}
              className="w-full bg-white/5 px-2.5 py-1 text-xs font-mono text-zinc-400
                         border border-zinc-800 focus:border-zinc-600 focus:outline-none
                         placeholder:text-zinc-600"
              placeholder="tag1, tag2, tag3..."
            />
          </div>
        ) : (
          post.tags && post.tags.length > 0 && (
            <div className="mt-6 flex flex-wrap gap-2">
              {post.tags.map((tag) => (
                <span
                  key={tag}
                  className="bg-white/5 px-2.5 py-1 text-xs font-mono text-zinc-500 border border-zinc-800"
                >
                  {tag}
                </span>
              ))}
            </div>
          )
        )}

        <div className="mt-10 border-t border-zinc-800" />

        <div className="mt-10">
          <MarkdownEditor
            value={post.content}
            editing={isEditing}
            editorRef={editorRef}
          />
        </div>

        <div className="mt-20 border-t border-zinc-800 pt-8">
          <button
            onClick={onBack}
            className="text-lg font-mono text-white hover:text-white transition-colors"
          >
            back.
          </button>
        </div>
      </div>
    </div>
  );
}
