import MarkdownEditor from "./MarkdownEditor";

function formatDate(iso) {
  return new Date(iso)
    .toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    })
    .toUpperCase();
}

export default function BlogPost({ post, isEditing, editRef, onBack }) {
  return (
    <div className="fixed inset-0 z-50 bg-black overflow-y-auto">
      <div className="px-[20%] py-16">
        <button
          onClick={onBack}
          className="text-lg font-mono text-white hover:text-white transition-colors mb-16"
        >
          back.
        </button>

        <time className="ml-10 font-mono text-sm tracking-widest text-zinc-500 uppercase">
          {formatDate(post.created_at)}
        </time>
        <h1 className="mt-4 text-3xl font-bold tracking-tight text-white sm:text-4xl">
          {post.title}
        </h1>

        {post.tags && post.tags.length > 0 && (
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
        )}

        <div className="mt-10 border-t border-zinc-800" />

        <div className="mt-10">
          <MarkdownEditor
            value={post.content}
            editing={isEditing}
            editorRef={editRef}
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
