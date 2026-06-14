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

export default function BlogPost({ post, isEditing, editRef, onBack, onUploadImage }) {
  const [editTitle, setEditTitle] = useState(post.title);
  const [editCoverImage, setEditCoverImage] = useState(post.cover_image || "");
  const [editTags, setEditTags] = useState((post.tags || []).join(", "));
  const [coverUploading, setCoverUploading] = useState(false);
  const [coverDragActive, setCoverDragActive] = useState(false);
  const editorRef = useRef(null);
  const titleRef = useRef(null);
  const coverDragDepthRef = useRef(0);

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
        getCoverImage: () => editCoverImage.trim(),
        getTags: () => editTags.split(",").map((t) => t.trim()).filter(Boolean),
      };
    }
  }, [editRef, post.content, editTitle, editCoverImage, editTags]);

  const uploadCover = async (file) => {
    if (!file || !onUploadImage) return;
    setCoverUploading(true);
    try {
      const url = await onUploadImage(file);
      if (url) {
        setEditCoverImage(url);
      }
    } finally {
      setCoverUploading(false);
    }
  };

  const handleCoverFileChange = async (event) => {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;
    await uploadCover(file);
  };

  const handleCoverDragEnter = (event) => {
    event.preventDefault();
    event.stopPropagation();
    coverDragDepthRef.current += 1;
    if (event.dataTransfer?.types?.includes("Files")) {
      setCoverDragActive(true);
    }
  };

  const handleCoverDragOver = (event) => {
    event.preventDefault();
    event.stopPropagation();
    if (event.dataTransfer) {
      event.dataTransfer.dropEffect = "copy";
    }
  };

  const handleCoverDragLeave = (event) => {
    event.preventDefault();
    event.stopPropagation();
    coverDragDepthRef.current = Math.max(0, coverDragDepthRef.current - 1);
    if (coverDragDepthRef.current === 0) {
      setCoverDragActive(false);
    }
  };

  const handleCoverDrop = async (event) => {
    event.preventDefault();
    event.stopPropagation();
    coverDragDepthRef.current = 0;
    setCoverDragActive(false);
    const file = Array.from(event.dataTransfer?.files || []).find((item) =>
      item.type.startsWith("image/")
    );
    if (!file) return;
    await uploadCover(file);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black overflow-y-auto">
      {(!isEditing && post.cover_image) ? (
        <div className="relative h-[38vh] min-h-[260px] w-full overflow-hidden border-b border-zinc-800">
          <img
            src={post.cover_image}
            alt={post.title}
            className="absolute inset-0 h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-black/35 to-black/90" />
        </div>
      ) : null}
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
          <div
            className={`relative mt-6 border ${coverDragActive ? "border-white/40" : "border-transparent"}`}
            onDragEnter={handleCoverDragEnter}
            onDragOver={handleCoverDragOver}
            onDragLeave={handleCoverDragLeave}
            onDrop={handleCoverDrop}
          >
            {coverDragActive ? (
              <div className="pointer-events-none absolute inset-0 z-10 flex items-center justify-center border border-dashed border-white/30 bg-black/70 text-xs font-mono uppercase tracking-[0.28em] text-white">
                drop cover image here
              </div>
            ) : null}
            <div className="flex flex-col gap-3 md:flex-row">
              <input
                value={editCoverImage}
                onChange={(e) => setEditCoverImage(e.target.value)}
                className="w-full bg-white/5 px-3 py-3 text-sm text-zinc-300 border border-zinc-800 focus:border-zinc-600 focus:outline-none placeholder:text-zinc-600"
                placeholder="Cover image URL..."
              />
              <label className="cursor-pointer border border-zinc-800 px-4 py-3 text-xs font-mono uppercase tracking-[0.24em] text-zinc-300 transition-colors hover:border-zinc-600 hover:text-white">
                {coverUploading ? "uploading..." : "upload cover"}
                <input
                  type="file"
                  accept="image/png,image/jpeg,image/jpg,image/gif,image/webp"
                  className="hidden"
                  onChange={handleCoverFileChange}
                  disabled={coverUploading}
                />
              </label>
            </div>
          </div>
        ) : null}

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
            onUploadImage={onUploadImage}
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
