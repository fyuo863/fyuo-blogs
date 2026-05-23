import { useState, useRef } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import remarkCallout from "../utils/remarkCallout";
import MarkdownEditor from "../components/MarkdownEditor";
import Callout from "../components/Callout";

function formatDate(iso) {
  return new Date(iso)
    .toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    })
    .toUpperCase();
}

const POSTS = [
  {
    id: 1,
    title: "Building a blog with Tailwind CSS and React",
    content: `I've been wanting to rebuild my personal site for a while. The old one was a WordPress instance that I'd been kicking down the road since 2019 — slow, bloated, and frankly embarrassing for someone who writes code for a living.

## Why Tailwind?

I was skeptical at first. Inline styles have been a punchline in the frontend community for years. But after a week of building with Tailwind, I get it now. The key insight is that utility classes aren't inline styles — they're a design system expressed as composable tokens. When you write \`flex items-center gap-4\`, you're not styling; you're composing layout primitives.

The real productivity gain comes from never leaving your JSX. No context-switching between \`.css\` files and components. No naming things. No dead code accumulation because unused classes are stripped at build time.

## The Stack

- **Vite** for the build tool — fast enough that I forget it's there
- **React 19** with functional components and hooks
- **Tailwind CSS v3.4** with the dark mode preset
- **lucide-react** for icons — tree-shakeable and consistent

## Dark Mode Done Right

The official Tailwind blog was my north star. Pure black background, zinc-toned borders, monospaced dates, and those razor-thin horizontal dividers between posts. No rounded corners — everything is sharp and deliberate. The typography does all the heavy lifting: tight tracking on headlines, generous line-height on body text, and a grayscale palette that stays readable without straining your eyes.

## What's Next

I'm wiring up the backend in Go with Gin and GORM. PostgreSQL for the database because I want the text array type for tags. Redis for session caching. The plan is to keep the API surface small — just CRUD on articles and a simple auth flow.

> [!tip] 标准格式
> 使用 \`> [!type]\` 语法创建提示框。支持 note、tip、info、warning、danger 等多种类型。

The biggest lesson so far: don't overthink your blog. Ship it, write in it, and iterate. The content matters more than the stack.`,
    stage: "published",
    vol: 1,
    author_id: 1,
    created_at: "2026-05-08T12:00:00Z",
    updated_at: "2026-05-10T09:30:00Z",
    tags: ["React", "Tailwind CSS", "Frontend", "Design"],
  },
  {
    id: 2,
    title: "How we rebuilt our documentation site with Next.js and MDX",
    content: `Last quarter we shipped a complete rewrite of our documentation platform. The old site was a static Jekyll build that took 12 minutes to deploy. Every typo fix meant waiting for CI, and the search was client-side Fuse.js that choked on our 400+ page corpus.

## The Requirements

We had four non-negotiable constraints going in:

1. **Sub-second full-text search** across all documentation pages
2. **Hot-reload preview** for authors writing MDX content
3. **Versioned docs** so users on older SDKs don't get broken references
4. **Zero client-side layout shift** — the old site jumped around like crazy on load

## Architecture Decisions

We landed on Next.js App Router with MDX compiled at build time via \`next-mdx-remote\`. The key architectural choice was moving search to a server-side endpoint backed by a Meilisearch index that rebuilds in under 3 seconds on content changes.

For versioning, each SDK release gets its own directory under \`/docs/v2.3/\`, \`/docs/v2.4/\`, etc. The router checks the URL prefix and resolves the correct MDX file tree. A small middleware handles redirects for deprecated endpoints.

## What We Got Wrong

Server Components are great until they're not. We had to sprinkle \`"use client"\` directives more liberally than we wanted — the interactive code sandbox embeds and the theme toggle both need client-side state. The boundary between server and client code is still the hardest part of the RSC model to explain to junior devs.

We also underestimated the complexity of incremental static regeneration with our versioned content tree. About 200 of our 400 pages never change (old SDK versions), but Next.js still runs ISR checks on them. We ended up configuring \`stale-while-revalidate\` headers at the CDN level and disabling ISR entirely for versioned directories older than 6 months.

## The Numbers

Build times dropped from 12 minutes to 90 seconds. Search latency went from ~800ms client-side to ~40ms server-side. Author feedback cycle went from "push and wait" to instant preview. The team is happy, and more importantly, our users stopped complaining about the docs site in the issue tracker.`,
    stage: "published",
    vol: 1,
    author_id: 1,
    created_at: "2026-04-22T14:00:00Z",
    updated_at: "2026-04-25T11:00:00Z",
    tags: ["Next.js", "MDX", "Documentation", "Architecture"],
  },
  {
    id: 3,
    title: "Designing a type scale that actually works",
    content: `Typography is 95% of web design, but most type scales are designed in a vacuum. Someone picks a ratio (1.25, 1.333, 1.5), plugs it into a calculator, and calls it done. Then the real content shows up and nothing looks right.

## Start With the Body

Every type scale should start from the body text size and work outward. Your body text is what people read most — it's the anchor. I use 16px as a baseline (browser default), set \`line-height: 1.6\` for comfortable reading, and measure at ~65 characters per line on desktop.

From there, the scale radiates in both directions: smaller for captions and metadata, larger for headings and display text.

## The Scale I Use

Here's the concrete set of sizes that's worked across a dozen projects:

| Role    | Size  | Weight  | Line Height |
|---------|-------|---------|-------------|
| caption | 12px  | 400     | 1.5         |
| body-sm | 14px  | 400     | 1.55        |
| body    | 16px  | 400     | 1.6         |
| h4      | 18px  | 600     | 1.4         |
| h3      | 22px  | 600     | 1.35        |
| h2      | 28px  | 700     | 1.3         |
| h1      | 36px  | 800     | 1.15        |
| display | 48px+ | 800     | 1.05        |

## Why Not a Mathematical Ratio?

Pure ratios (like 1.25× modular scale) produce too many unusable intermediate sizes. A jump from 16px × 1.25 = 20px to 20px × 1.25 = 25px gives you three sizes for body, subhead, and heading — but leaves gaps at 18px and 22px where you actually need them for UI labels and card titles.

Hand-tuned scales are better because they respect how designers actually work. You pick sizes based on visual need, not mathematical purity. The constraint is consistency — once you choose a set, use it everywhere.

## Fluid Scaling

On large screens (>1440px), the display and h1 sizes should scale up using \`clamp()\`. A display heading that reads well at 48px on a laptop feels undersized on a 27-inch monitor. I use:

\`\`\`css
h1 {
  font-size: clamp(36px, 2.5vw, 56px);
}
\`\`\`

This keeps things proportional without needing breakpoints for every heading level.

## Dark Mode Considerations

White text on black backgrounds appears slightly thicker due to optical illusions. If you're doing dark mode (and you should for a developer blog), consider dropping font-weight by 100 for all headings in dark mode, or using a slightly lighter color (like \`#f0f0f0\` instead of pure white) to reduce the bloom effect.`,
    stage: "published",
    vol: 1,
    author_id: 1,
    created_at: "2026-03-15T08:00:00Z",
    updated_at: "2026-03-16T16:00:00Z",
    tags: ["Typography", "Design", "CSS", "Dark Mode"],
  },
  {
    id: 4,
    title: "The case for utility-first CSS in 2026",
    content: `Four years after the Tailwind vs. CSS-in-JS debate supposedly "settled," the data is finally in. I've spent the last quarter auditing five production codebases — three Tailwind, two styled-components — and the differences in maintenance burden, bundle size, and developer experience are larger than I expected.

## Bundle Size

The styled-components codebases shipped an average of 47KB of runtime CSS-in-JS overhead (pre-gzip). The Tailwind codebases shipped zero runtime — all styles are extracted at build time. After purging unused classes, the largest Tailwind stylesheet I measured was 8.4KB gzipped.

That's a 5.6× difference before you write a single style rule.

## Dead Code

Here's the stat that convinced me: across the two styled-components codebases, 23% of style declarations matched no existing DOM elements. They were orphaned styles — components got refactored or deleted, but their style objects remained because static analysis can't trace dynamic template literals.

Tailwind's PurgeCSS integration makes dead styles a compile-time error. If a class isn't in your source files, it doesn't make it to production. Zero orphaned styles, guaranteed.

## Developer Experience

The "long className strings are ugly" argument is real. I won't pretend that \`className="flex items-center gap-2 px-4 py-2 text-sm font-medium"\` is beautiful. But the alternative — jumping between a component file and a separate \`.module.css\` file, inventing class names, and fighting specificity wars — is worse in practice.

The teams using Tailwind shipped UI changes 40% faster on average, measured from ticket acceptance to merged PR. Most of that gain came from eliminating the "where does this style live" decision and the "what should I name this wrapper div" bikeshedding.

## The Verdict

Utility-first CSS isn't a silver bullet, but for application UI development in 2026, it's the most pragmatic choice available. The bundle size savings alone pay for the learning curve, and the dead code elimination means your stylesheet actually shrinks over time instead of growing unbounded.

If you're still on the fence, audit your current CSS bundle. Run a coverage report in Chrome DevTools. The numbers will make the argument better than I ever could.`,
    stage: "published",
    vol: 1,
    author_id: 1,
    created_at: "2026-02-03T10:00:00Z",
    updated_at: "2026-02-05T13:00:00Z",
    tags: ["CSS", "Tailwind CSS", "Performance", "DX"],
  },
];

const MENU_ITEMS = [
  { label: "creat,", action: "create" },
  { label: "exit.", action: "logout" },
];

function Home({ username, onOpenSignIn, onLogout }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [selectedPost, setSelectedPost] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const editRef = useRef(null);

  const isBlogView = selectedPost !== null;
  const blogItems = isEditing
    ? [
        { label: "save,", action: "save" },
        { label: "discard,", action: "discard" },
        { label: "back,", action: "back" },
      ]
    : [
        { label: "edit,", action: "edit" },
        { label: "back,", action: "back" },
      ];
  const currentMenu = isBlogView ? blogItems : MENU_ITEMS;

  const handleMenuAction = (action) => {
    setMenuOpen(false);
    if (action === "logout") onLogout();
    if (action === "back") {
      setSelectedPost(null);
      setIsEditing(false);
    }
    if (action === "edit") {
      setIsEditing(true);
    }
    if (action === "save") {
      setSelectedPost({
        ...selectedPost,
        content: editRef.current?.getContent() ?? selectedPost.content,
      });
      setIsEditing(false);
    }
    if (action === "discard") {
      setIsEditing(false);
    }
  };

  return (
    <div className="min-h-screen bg-black">
      {/* ── 首页左上角标题 ── */}
      <div className="fixed top-0 left-0 z-[60] px-4 py-4 sm:px-6 lg:px-8">
        <span className="text-lg font-bold tracking-tight text-white italic">
          fyuo-blogs.
        </span>
      </div>

      {/* ── 首页左下角菜单 ── */}
      <div className="fixed bottom-0 left-0 z-[60] px-4 py-4 sm:px-6 lg:px-8">
        {username ? (
          <div className="flex flex-col items-start">
            {/* Slide-up menu */}
            <div
              className={`flex flex-col items-start overflow-hidden transition-all duration-300 ease-out ${
                menuOpen ? "max-h-60 opacity-100 mb-2" : "max-h-0 opacity-0"
              }`}
            >
              {currentMenu.map((item) => (
                <button
                  key={item.label}
                  onClick={() => handleMenuAction(item.action)}
                  className="text-lg font-bold tracking-tight text-zinc-500 hover:text-white transition-colors py-0.5"
                >
                  {item.label}
                </button>
              ))}
            </div>
            {/* Trigger */}
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="text-lg font-bold tracking-tight text-white hover:text-zinc-300 transition-colors"
            >
              home.
            </button>
          </div>
        ) : (
          <button
            onClick={onOpenSignIn}
            className="text-lg font-bold tracking-tight text-zinc-500 hover:text-white transition-colors"
          >
            log-in.
          </button>
        )}
      </div>

      {/* ── 头部区域 ── */}
      <div className="relative w-full h-72 sm:h-80 md:h-96 border-t border-b border-zinc-800 group flex items-center overflow-hidden">
        {/* 1. 底层图片：绝对定位铺满容器，使用 group-hover 响应整个区域的鼠标悬停 */}
        <img
          // 请替换为你实际的图片路径或 URL
          src="https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=2564&auto=format&fit=crop"
          alt="Blog Cover"
          className="absolute inset-0 w-full h-full object-cover grayscale opacity-70 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-700 z-0"
        />

        {/* 2. (可选) 半透明遮罩层：防止图片恢复色彩后过亮导致文字看不清 */}
        <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors duration-700 z-0"></div>

        {/* 3. 上层文字区：提升 z-index 保证在图片上方，同时保持 px-[20%] 的黄金阅读对齐线 */}
        <header className="relative z-10 px-[20%] w-full">
          {/* 使用 [-webkit-text-stroke:2px_black] 实现黑底白字描边，并加上文字阴影增加立体感 */}
          <h1 className="text-5xl font-extrabold tracking-tighter text-white drop-shadow-xl">
            Latest Updates
          </h1>

          {/* 引导语也改成了纯白色+1px黑色描边，防止在复杂图片背景中糊掉 */}
          <p className="mt-6 text-lg font-bold text-white leading-relaxed drop-shadow-md">
            All the latest blogs, straight from
          </p>
          <span className="text-lg font-extrabold tracking-tight text-white drop-shadow-md">
            fyuo.
          </span>
        </header>
      </div>

      {/* ── 搜索栏 ── */}
      <div className="border-t border-b border-zinc-800">
        <div className="px-[20%] py-12">
          <div className="flex flex-col gap-3 sm:flex-row">
            <div className="relative flex-1">
              {/* <Mail
                size={18}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500 pointer-events-none"
              /> */}
              <input
                type="email"
                placeholder="serch,"
                className="w-full bg-white/5 py-3 pl-5 pr-5 text-sm text-white placeholder:text-zinc-500 border border-zinc-800 focus:border-zinc-600 focus:outline-none transition-colors"
              />
            </div>
            <button className="bg-white/10 px-7 py-3 text-base font-semibold text-white hover:bg-white/20 active:bg-white/5 transition-colors shrink-0">
              search.
            </button>
          </div>
        </div>
      </div>

      {/* ── 博客展示页 ── */}
      <div className="px-[20%]">
        <div className="divide-y divide-zinc-800">
          {POSTS.map((post) => (
            <article key={post.id} className="py-16">
              <time className="font-mono text-sm tracking-widest text-zinc-500 uppercase">
                {formatDate(post.created_at)}
              </time>
              <h2 className="mt-4 text-2xl font-bold tracking-tight text-white">
                {post.title}
              </h2>
              <p className="mt-4 text-zinc-400 leading-relaxed">
                {post.content.slice(0, 200)}...
              </p>
              <button
                onClick={() => setSelectedPost(post)}
                className="mt-6 inline-block text-white font-semibold hover:text-zinc-300 transition-colors"
              >
                read-more,
              </button>
            </article>
          ))}
        </div>
      </div>

      {/* ── 底部留白 ── */}
      <div className="h-24" />

      {/* ── 博客内容展示 ── */}
      {selectedPost && (
        <div className="fixed inset-0 z-50 bg-black overflow-y-auto">
          <div className="px-[20%] py-16">
            <button
              onClick={() => setSelectedPost(null)}
              className="text-lg font-mono text-white hover:text-white transition-colors mb-16"
            >
              back.
            </button>

            <time className="ml-10 font-mono text-sm tracking-widest text-zinc-500 uppercase">
              {formatDate(selectedPost.created_at)}
            </time>
            <h1 className="mt-4 text-3xl font-bold tracking-tight text-white sm:text-4xl">
              {selectedPost.title}
            </h1>

            {selectedPost.tags && selectedPost.tags.length > 0 && (
              <div className="mt-6 flex flex-wrap gap-2">
                {selectedPost.tags.map((tag) => (
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

            {/* ── Live Preview 编辑 / 阅读模式 ── */}
            {isEditing ? (
              <div className="mt-10">
                <MarkdownEditor
                  value={selectedPost.content}
                  editorRef={editRef}
                />
              </div>
            ) : (
              <div className="mt-10 text-zinc-400 prose prose-invert prose-zinc max-w-none prose-pre:bg-white/5 prose-pre:border prose-pre:border-zinc-800">
                <ReactMarkdown
                  remarkPlugins={[remarkGfm, remarkCallout]}
                  components={{
                    div({ className, 'data-callout-title': title, children, ...props }) {
                      if (className?.startsWith('callout')) {
                        const type = className.replace('callout callout-', '');
                        return (
                          <Callout type={type} title={title}>
                            {children}
                          </Callout>
                        );
                      }
                      return <div className={className} {...props}>{children}</div>;
                    },
                  }}
                >
                  {selectedPost.content}
                </ReactMarkdown>
              </div>
            )}

            <div className="mt-20 border-t border-zinc-800 pt-8">
              <button
                onClick={() => setSelectedPost(null)}
                className="text-lg font-mono text-white hover:text-white transition-colors"
              >
                back.
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Home;
