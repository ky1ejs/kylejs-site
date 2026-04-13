# Assessment: Migrating from Next.js to Astro

## Context

This site (kylejs.me) is a personal blog/portfolio built with Next.js 16, React 19, and TypeScript. It is **fully static** — no API routes, no middleware, no server actions, no ISR, no database. The site has 4 routes, 6 blog posts, and ~15 components.

The question: would migrating to Astro be beneficial, especially given a potential move from Vercel to Cloudflare?

---

## 1. Why Astro Is a Strong Fit

### 1.1 This site is exactly what Astro was built for

Astro's tagline is "the web framework for content-driven websites." This site is a static blog with MDX content — the canonical Astro use case. Next.js is a full-stack React framework; this site uses roughly 5% of its capabilities.

### 1.2 JavaScript shipped to clients

**Next.js** ships the React runtime (~85KB gzipped) to every page, even though most pages have zero interactivity. The home page, posts listing, and individual post pages are all server-rendered static content that gets hydrated client-side for no functional benefit.

**Astro** ships **zero JavaScript by default**. Interactive components (theme toggle, mermaid diagrams, bio selector) would be hydrated as isolated "islands" — only the specific components that need JS get it. Expected reduction: **~90% less JS** shipped to visitors.

### 1.3 Cloudflare is now Astro's parent company

Cloudflare [acquired the Astro team in January 2026](https://blog.cloudflare.com/astro-joins-cloudflare/). Astro 6 (stable since March 10, 2026) includes:
- Dev server running on Cloudflare's `workerd` runtime — true dev/prod parity
- First-class Cloudflare Workers adapter
- Native integration with Cloudflare D1, R2, KV

This makes Astro the **most natively supported framework on Cloudflare**, with the strongest long-term investment trajectory.

### 1.4 Content Collections replace hand-rolled code

The current site has ~140 lines of custom content infrastructure:
- `lib/posts.ts` — manual file reading, frontmatter parsing, date sorting
- `lib/markdown-compile.tsx` — manual MDX compilation with plugin wiring

Astro's [Content Collections](https://docs.astro.build/en/guides/content-collections/) replace all of this with:
- A Zod schema for type-safe frontmatter validation
- Built-in MDX compilation
- Automatic sorting/filtering/querying APIs
- Zero custom code needed

### 1.5 Cloudflare hosting benefits

| | Vercel (current) | Cloudflare Pages |
|---|---|---|
| **Bandwidth** | 100GB/month (free tier) | Unlimited |
| **Builds** | 6000 min/month | 500 builds/month (unlimited minutes) |
| **Edge locations** | ~20 regions | 300+ cities globally |
| **Cost** | Free tier sufficient now | Free tier sufficient |
| **Analytics** | Vercel Analytics (included) | Cloudflare Web Analytics (free, privacy-focused) |
| **Lock-in** | @vercel/analytics, @vercel/speed-insights | Minimal (standard web platform) |

---

## 2. Feature-by-Feature Migration Map

### 2.1 Routing and Layouts
| Current (Next.js) | Astro Equivalent | Effort |
|---|---|---|
| `app/layout.tsx` (root) | `src/layouts/Base.astro` | Low |
| `app/(site)/layout.tsx` (site) | `src/layouts/Site.astro` (nested) | Low |
| `app/page.tsx` (home) | `src/pages/index.astro` | Low |
| `app/(site)/about/page.tsx` | `src/pages/about.astro` | Low |
| `app/(site)/posts/page.tsx` | `src/pages/posts/index.astro` | Low |
| `app/(site)/posts/[id]/page.tsx` | `src/pages/posts/[id].astro` | Low |
| `generateStaticParams()` | `getStaticPaths()` | Low |
| `generateMetadata()` | Frontmatter + `<head>` in layout | Low |
| Route group `(site)` | Layout composition | Low |

**Verdict:** Routing is a near 1:1 mapping. Low effort.

### 2.2 MDX Content and Rehype Plugins
| Current | Astro Equivalent | Effort |
|---|---|---|
| `@mdx-js/mdx` manual compilation | `@astrojs/mdx` integration (built-in) | Eliminated |
| `gray-matter` frontmatter parsing | Content Collections with Zod schemas | Eliminated |
| `lib/posts.ts` content system | Content Collections API | Eliminated |
| `rehype-heading-ids.ts` | Works unchanged in `astro.config.mjs` | None |
| `rehype-callouts.ts` | Works unchanged | None |
| `rehype-mermaid-blocks.ts` | Works unchanged | None |
| `rehype-image-size.ts` | Needs adaptation for `astro:assets` | Medium |
| `remark-gfm` | Works unchanged | None |

**Verdict:** 3 of 4 rehype plugins are framework-agnostic and work as-is. The image plugin needs rework to use Astro's image pipeline instead of `next/image`. Content infrastructure code is eliminated entirely.

### 2.3 Components
| Component | Current Type | Astro Migration | Effort |
|---|---|---|---|
| PostMetadata | Server | Astro component | Low |
| PostHeader | Server | Astro component | Low |
| PostFooter | Server | Astro component | Low |
| Copyright | Server | Astro component | Low |
| Pill / PillCollection | Server | Astro component | Low |
| GitHubRepoCard | Server | Astro component | Low |
| HeadingWithLink | Client | Astro + inline `<script>` | Low |
| RelativeDateLabel | Client | Astro + inline `<script>` | Low |
| WaveLabel | Client | CSS-only (already CSS animation) | Low |
| HomeThemeButton | Client | Vanilla JS script | Low |
| DownloadFile | Client | Astro + inline `<script>` | Low |
| Selector | Client | Keep as React island (`client:visible`) | Medium |
| Bio | Client | Keep as React island (`client:visible`) | Medium |
| Mermaid | Client | Keep as React island (`client:idle`) | Low |
| Theme system | Client (Context) | Vanilla JS `<script>` + CSS variables | Medium |

**Verdict:** ~10 components become zero-JS Astro components. ~3 small interactive components can use inline `<script>` tags. Only 2-3 components (Bio selector, Mermaid, optionally theme) need React islands via `@astrojs/react`.

### 2.4 Theme System

The current theme uses React Context, cookie persistence, and a `<script>` in `<head>` for flash prevention. In Astro:
- The inline `<script>` in `<head>` transfers as-is (already vanilla JS)
- The React Context provider is replaced by a standalone vanilla JS script that manages `data-theme` attribute and cookies
- The ThemeButton dropdown becomes either vanilla JS or a small React island
- CSS variables and `data-theme` selectors transfer unchanged

**Verdict:** Medium effort. The CSS-variable theme system and flash-prevention script are already framework-agnostic. The React Context wrapper is the main piece to rearchitect.

### 2.5 Image Optimization
| Current | Astro Equivalent |
|---|---|
| `next/image` with automatic optimization | `astro:assets` `<Image>` component |
| `sharp` for processing | `sharp` (same — Astro uses it too) |
| `plaiceholder` for blur placeholders | May need custom integration or alternative |
| `image-size` for dimensions | Astro auto-detects dimensions |
| `@svgr/webpack` for SVG components | `astro-icon` or inline SVGs |

**Verdict:** Astro's image pipeline handles optimization, format negotiation, and dimension detection natively. The blur placeholder feature requires either adapting `plaiceholder` or using Astro's built-in placeholder support. SVG handling changes from webpack imports to a different pattern (inline or `astro-icon`).

### 2.6 SEO / Metadata

Current approach uses Next.js `Metadata` API and `generateMetadata()` for OG/Twitter cards. In Astro:
- Static metadata goes directly in `<head>` within layouts
- Dynamic metadata (per-post OG tags) uses frontmatter props passed to layouts
- Consider `astro-seo` package for convenience, or just write `<meta>` tags directly

**Verdict:** Low effort. Arguably simpler than Next.js Metadata API.

### 2.7 Analytics

| Current | Options on Cloudflare |
|---|---|
| `@vercel/analytics` | Cloudflare Web Analytics (free, no JS needed — server-side) |
| `@vercel/speed-insights` | Cloudflare Browser Insights or standard Web Vitals reporting |

**Verdict:** Cloudflare Web Analytics is simpler (one DNS toggle, no client-side JS). Removes two dependencies.

### 2.8 Styling (Tailwind CSS)

Tailwind CSS v4 works identically in Astro. The `globals.css` with CSS variables, all theme definitions, animations, and utility classes transfer with zero changes. Astro has first-class Tailwind support via `@astrojs/tailwind` or direct PostCSS config.

**Verdict:** Zero effort. Copy-paste.

---

## 3. What You'd Lose

| Concern | Impact | Mitigation |
|---|---|---|
| **Client-side navigation** (`next/link`) | Full page reloads between routes | Astro's `ViewTransitions` API provides smooth transitions with minimal JS |
| **React dev experience** | Most components rewritten as `.astro` | Astro component syntax is simpler (HTML + frontmatter script). React available for interactive islands |
| **Vercel DX** | Instant preview deploys, branch deploys | Cloudflare Pages has preview deploys per branch too |
| **Ecosystem maturity** | Next.js has larger ecosystem | For a static blog, Astro's ecosystem covers everything needed |
| **Hydration control** | React hydrates everything | Islands architecture requires thinking about what needs JS (this is a benefit, not a cost) |

---

## 4. Analytics Migration: Vercel → Cloudflare

### What you currently get from Vercel
- `@vercel/analytics` — page views, unique visitors, top pages, referrers, countries, browsers/OS
- `@vercel/speed-insights` — Core Web Vitals (LCP, FID, CLS) with real user monitoring

### What Cloudflare Web Analytics provides
- Page views, visits, top pages, referrers, countries, browsers/OS — same core metrics
- **Privacy-first**: no cookies, no localStorage, no fingerprinting
- **Free** on all plans, unlimited sites
- Can be enabled via DNS toggle (server-side, zero JS) or lightweight JS beacon
- Cloudflare has committed to comprehensive performance monitoring platform by mid-2026

### What you'd lose
- Vercel's "Experience Score" composite UX metric
- Per-deployment analytics (analytics scoped to preview deploys)
- Vercel's simpler dashboard UX for basic metrics

### What you'd gain
- No client-side JS required when using DNS-based analytics
- Broader traffic visibility (all requests, not just JS-enabled browsers)
- Security analytics (threat insights, bot traffic) as a bonus
- **No vendor lock-in** — if you leave Cloudflare, standard analytics tools work anywhere

### Alternatives if Cloudflare Web Analytics isn't enough
- [Plausible](https://plausible.io) — privacy-friendly, richer dashboard ($9/mo)
- [Fathom](https://usefathom.com) — privacy-friendly, simple ($14/mo)
- Both work on any hosting provider

---

## 5. Future Interactivity (e.g., Post Upvotes)

Astro on Cloudflare actually **improves** the story for adding interactivity compared to current Next.js on Vercel.

### Server Endpoints (API Routes)
Astro supports [server endpoints](https://docs.astro.build/en/guides/endpoints/) — TypeScript files in `src/pages/api/` that export HTTP method handlers (GET, POST, etc.) and run on Cloudflare Workers.

### Cloudflare Data Platform (free tier)
| Service | Use Case | Free Tier |
|---|---|---|
| **D1** (SQLite at edge) | Upvote counts, comments | 5M reads/day, 100K writes/day |
| **KV** (key-value store) | Simple counters, feature flags | 100K reads/day, 1K writes/day |
| **R2** (object storage) | User-uploaded images | 10GB storage, 10M reads/mo |

### Example: Post Upvotes
```
src/pages/api/posts/[id]/upvote.ts  →  POST handler, writes to D1/KV
src/pages/posts/[id].astro          →  Renders count, small inline script for upvote button
```
- Runs at the edge (low latency globally)
- [Existing tutorial](https://snorre.io/blog/2024-05-06-likes-cloudflare-d1-astro-api-endpoints/) for exactly this pattern
- Astro 6's `workerd` dev server provides full D1/KV access locally

### Comparison to current stack
On Next.js + Vercel, equivalent functionality would require Vercel KV ($0.30/100K commands after free tier) or an external database. Cloudflare's free tier is significantly more generous.

---

## 6. Risk Assessment

| Risk | Likelihood | Impact | Mitigation |
|---|---|---|---|
| Rehype plugins break | Low | Medium | 3/4 are framework-agnostic; test during migration |
| Blur placeholder regression | Medium | Low | Astro has built-in image optimization; blur can be added via custom integration |
| Theme flash on load | Low | Low | The existing inline `<script>` approach works identically in Astro |
| Mermaid rendering issues | Low | Low | Same client-side library; just needs React island wrapper |
| Build/deploy issues on Cloudflare | Low | Medium | Astro + Cloudflare is first-party supported |

---

## 7. Estimated Migration Effort

| Phase | Estimated Time |
|---|---|
| 1. Scaffold Astro project, install deps | 1 hour |
| 2. Content Collections (posts + about) | 2 hours |
| 3. Layouts (Base + Site) and global styles | 2 hours |
| 4. Pages (home, about, posts, post detail) | 3 hours |
| 5. Static components (server → Astro) | 2 hours |
| 6. Interactive components (client → islands/scripts) | 3 hours |
| 7. Theme system migration | 2 hours |
| 8. Image pipeline and SVGs | 2 hours |
| 9. SEO/metadata and analytics | 1 hour |
| 10. Testing, polish, deploy to Cloudflare | 2 hours |
| **Total** | **~20 hours (2-3 days)** |

---

## 8. Alternative: Next.js on Cloudflare (OpenNext / Vinext)

It is possible to stay on Next.js and deploy to Cloudflare via [OpenNext](https://opennext.js.org/cloudflare) or the experimental [Vinext](https://blog.cloudflare.com/vinext/) project:

| | Astro on Cloudflare | Next.js on Cloudflare (OpenNext) |
|---|---|---|
| **Support level** | First-party (Cloudflare owns Astro) | Community adapter (third-party) |
| **Maturity** | Production-ready | Production-ready but compatibility gaps |
| **JS to client** | Near-zero | Full React runtime (~85KB) |
| **Complexity** | Native fit | Adapter layer adds complexity |
| **Dev/prod parity** | Full (workerd dev server) | Partial |
| **Long-term trajectory** | Growing investment | Uncertain — Cloudflare investing in Astro, not Next.js |

**Verdict:** OpenNext works, but you'd be shipping a full React SPA framework through a compatibility layer for a static blog. Astro is the simpler, more performant, and better-supported path on Cloudflare.

---

## 9. Recommendation

**Migrate to Astro 6 on Cloudflare Pages.**

Reasons:
1. **Right tool for the job** — This is a static content site. Astro is purpose-built for this; Next.js is overkill.
2. **~90% less JavaScript** shipped to visitors, improving performance on all devices.
3. **First-party Cloudflare support** — Astro is now owned by Cloudflare, making it the safest long-term bet for Cloudflare hosting.
4. **Less code to maintain** — Content Collections eliminate ~140 lines of custom content infrastructure. Most components become simpler `.astro` files.
5. **Simpler mental model** — No hydration, no server/client component boundaries, no React Context for static content.
6. **Modest effort** — ~20 hours for a complete migration. The site is small enough that this is a weekend project.
7. **Reduced vendor lock-in** — Removes `@vercel/analytics` and `@vercel/speed-insights` dependencies. Cloudflare Web Analytics needs no client-side JS.

---

## Sources
- [Cloudflare acquires Astro](https://blog.cloudflare.com/astro-joins-cloudflare/)
- [Astro joins Cloudflare (Astro blog)](https://astro.build/blog/joining-cloudflare/)
- [Astro 6 stable release](https://astro.build/blog/astro-6/)
- [Astro 6 Beta announcement](https://astro.build/blog/astro-6-beta/)
- [OpenNext for Cloudflare](https://opennext.js.org/cloudflare)
- [Vinext — Cloudflare's Next.js experiment](https://blog.cloudflare.com/vinext/)
- [Astro Cloudflare adapter docs](https://docs.astro.build/en/guides/integrations-guide/cloudflare/)
- [Cloudflare Web Analytics](https://www.cloudflare.com/web-analytics/)
- [Likes feature with D1 and Astro](https://snorre.io/blog/2024-05-06-likes-cloudflare-d1-astro-api-endpoints/)
- [Astro server endpoints docs](https://docs.astro.build/en/guides/endpoints/)
