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

function Home() {
  return (
    <div className="min-h-screen bg-slate-950">
      {/* ── Page Header ── */}
      <header className="mx-auto max-w-3xl px-4 pt-28 pb-16 sm:px-6 lg:px-8">
        <h1 className="text-5xl font-extrabold tracking-tighter text-white">
          Latest Updates
        </h1>
        <p className="mt-6 text-lg text-slate-300 leading-relaxed">
          All the latest Tailwind CSS news, straight from the team.
        </p>
      </header>

      {/* ── Newsletter ── */}
      <div className="border-t border-b border-slate-800">
        <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-3 sm:flex-row">
            <div className="relative flex-1">
              <Mail
                size={18}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none"
              />
              <input
                type="email"
                placeholder="Subscribe via email"
                className="w-full rounded-full bg-white/5 py-3 pl-11 pr-5 text-sm text-white placeholder:text-slate-500 border border-slate-800 focus:border-sky-500/50 focus:outline-none focus:ring-1 focus:ring-sky-500/30 transition-colors"
              />
            </div>
            <button className="rounded-full bg-slate-800 px-7 py-3 text-sm font-semibold text-white hover:bg-slate-700 active:bg-slate-600 transition-colors shrink-0">
              Subscribe
            </button>
          </div>
        </div>
      </div>

      {/* ── Blog Feed ── */}
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        <div className="divide-y divide-slate-800">
          {POSTS.map((post) => (
            <article key={post.id} className="py-16">
              <time className="font-mono text-sm tracking-widest text-slate-500 uppercase">
                {post.date}
              </time>
              <h2 className="mt-4 text-2xl font-bold tracking-tight text-white">
                {post.title}
              </h2>
              <p className="mt-4 text-slate-400 leading-relaxed">
                {post.excerpt}
              </p>
              <a
                href={`/posts/${post.slug}`}
                className="mt-6 inline-block text-sky-400 font-semibold hover:text-sky-300 transition-colors"
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
