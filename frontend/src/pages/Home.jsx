import { Mail } from "lucide-react";

const POSTS = [
  {
    id: 1,
    date: "MAY 8, 2026",
    title: "Building a blog with Tailwind CSS and React",
    excerpt:
      "Learn how to build a modern, dark-themed blog using the latest features of Tailwind CSS and React. We cover responsive layouts, typography systems, and component-driven design patterns that scale.",
    slug: "building-blog-tailwind-react",
  },
  {
    id: 2,
    date: "APRIL 22, 2026",
    title: "How we rebuilt our documentation site with Next.js and MDX",
    excerpt:
      "A deep dive into the architecture decisions, performance trade-offs, and content workflows behind our new documentation platform — from static generation to client-side search.",
    slug: "rebuilding-docs-nextjs-mdx",
  },
  {
    id: 3,
    date: "MARCH 15, 2026",
    title: "Designing a type scale that actually works",
    excerpt:
      "Typography is 95% of web design. Here's the systematic approach we use for building a fluid type scale that stays readable across every screen size, with real CSS examples.",
    slug: "designing-type-scale",
  },
  {
    id: 4,
    date: "FEBRUARY 3, 2026",
    title: "The case for utility-first CSS in 2026",
    excerpt:
      "Four years after the initial debate settled, here's what the data says about maintenance burden, bundle size, and developer experience in large-scale utility-first codebases.",
    slug: "utility-first-css-2026",
  },
];

function Home({ username, onOpenSignIn, onLogout }) {
  return (
    <div className="min-h-screen bg-black">
      {/* ── Floating site title (top-left) ── */}
      <div className="fixed top-0 left-0 z-40 px-4 py-4 sm:px-6 lg:px-8">
        <span className="text-lg font-bold tracking-tight text-white">
          fyuo-blogs.
        </span>
      </div>

      {/* ── Login / user pill (bottom-left) ── */}
      <div className="fixed bottom-0 left-0 z-40 px-4 py-4 sm:px-6 lg:px-8">
        {username ? (
          <div className="flex items-center gap-3">
            <span className="text-lg font-bold tracking-tight text-white">
              {username}
            </span>
            <button
              onClick={onLogout}
              className="text-lg font-bold tracking-tight text-zinc-500 hover:text-zinc-300 transition-colors"
            >
              &middot; exit
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

      {/* ── Page Header ── */}
      <header className="mx-auto max-w-3xl px-4 pt-28 pb-16 sm:px-6 lg:px-8">
        <h1 className="text-5xl font-extrabold tracking-tighter text-white">
          Latest Updates
        </h1>
        <p className="mt-6 text-lg text-zinc-400 leading-relaxed">
          All the latest blogs, straight from
        </p>

        <span className="text-lg font-bold tracking-tight text-white">
          fyuo.
        </span>
      </header>

      {/* ── Newsletter ── */}
      <div className="border-t border-b border-zinc-800">
        <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8">
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

      {/* ── Blog Feed ── */}
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        <div className="divide-y divide-zinc-800">
          {POSTS.map((post) => (
            <article key={post.id} className="py-16">
              <time className="font-mono text-sm tracking-widest text-zinc-500 uppercase">
                {post.date}
              </time>
              <h2 className="mt-4 text-2xl font-bold tracking-tight text-white">
                {post.title}
              </h2>
              <p className="mt-4 text-zinc-400 leading-relaxed">
                {post.excerpt}
              </p>
              <a
                href={`/posts/${post.slug}`}
                className="mt-6 inline-block text-white font-semibold hover:text-zinc-300 transition-colors"
              >
                Read more &rarr;
              </a>
            </article>
          ))}
        </div>
      </div>

      {/* ── Footer spacer ── */}
      <div className="h-24" />
    </div>
  );
}

export default Home;
