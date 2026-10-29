# Kyle's Personal Site - Development Guide

## Project Overview
An Astro personal website/blog built with TypeScript, Tailwind CSS, and MDX for content management. The site features a modern design with dark/light theme support and is optimized for performance with zero JavaScript shipped by default (React islands used only where interactivity is needed).

## Technology Stack
- **Framework**: Astro 7 (static output, Rust compiler, Vite 8)
- **Runtime**: Node.js 24.21.0 (`.nvmrc`; CI and Cloudflare Workers Builds read it). Astro needs >= 22.23.4; 24.21.0 is preinstalled on Cloudflare's build image, so builds skip the Node download
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4 (CSS-first config via @tailwindcss/vite)
- **Package Manager**: pnpm
- **Content**: Astro Content Collections with MDX
- **Markdown**: Sätteri processor (`@astrojs/markdown-satteri`); GFM and smart punctuation are built in
- **Image Processing**: Sharp (via astro:assets)
- **UI Islands**: React (for Mermaid diagrams and interactive components)

## Available Scripts
- `pnpm dev` - Start development server
- `pnpm build` - Build for production (static output to `dist/`)
- `pnpm preview` - Preview production build locally
- `pnpm lint` - Run ESLint
- `pnpm lint:fix` - Run ESLint with auto-fix
- `pnpm check:images` - After a build, fail on images in `public/` or built images over 400 KB

## Project Structure

### Pages (`/src/pages`)
- `index.astro` - Home/landing page
- `about.astro` - About page with bio toggle
- `posts/index.astro` - Blog listing
- `posts/[id].astro` - Individual blog post (dynamic route)

### Layouts (`/src/layouts`)
- `Base.astro` - Root HTML layout with theme script, SEO meta, ViewTransitions
- `Site.astro` - Site layout with header nav, footer
- `Post.astro` - Post layout wrapping Site with `.post` class

### Content (`/src/content`)
- `blog/` - MDX/MD blog posts (frontmatter: title, description?, date, shareImage?, reviewers?)
- `drafts/` - Draft blog posts

### Components (`/src/components`)
- `.astro` components - PageLoader (page prefetch cache and loading skeleton, rendered by `Base.astro`), MermaidDiagram (hydrates Mermaid with `client:idle`), ThemeButton, PostMetadata, PostHeader, PostFooter, Copyright, RelativeDateLabel, HeadingLinks (copies a heading's URL when its link is clicked)
- `.tsx` React components - Mermaid (client:idle), Pill, GitHubRepoCard, DownloadFile, MdxImage, Bio, Selector

### Library (`/src/lib`)
- `reading-time.ts` - Reading time calculation
- `hast-heading-ids.ts` - Sätteri hast plugin for heading anchor IDs (keeps existing anchors stable; Astro's built-in slugger would change them)
- `hast-callouts.ts` - GitHub-style callout blockquotes
- `hast-heading-marks.ts` - Wraps each h2's content in `<span class="heading-mark">` for the highlighter style
- `hast-heading-links.ts` - Adds a copy-link anchor beside each heading with an ID (React components in MDX overrides are never hydrated, so this is done at build time)
- `hast-footnote-ref-separators.ts` - Comma between adjacent footnote refs
- `hast-mermaid-blocks.ts` - Mermaid code block → `<Mermaid>` component in MDX (needs `mermaid` in `syntaxHighlight.excludeLangs`)

### About Content (`/content/about`)
- `intro.mdx`, `professional.mdx`, `personal.mdx` - `about` content collection, rendered by `about.astro` with `render()` through the same Sätteri pipeline and component overrides as blog posts

### Styling
- **Global CSS**: `src/styles/global.css` with Tailwind v4, CSS variable theme system, animations
- **Dark Mode**: `data-theme` attribute with `@variant dark` in Tailwind
- **Color System**: CSS custom properties defined per theme (light/dark), registered in `@theme` block

## Key Features

### Theme System
- Light/dark/system mode toggle (vanilla JS, no React)
- Preference stored in cookies
- Inline script in `<head>` prevents flash of unstyled content
- Re-initializes after ViewTransitions page swaps

### Blog
- Astro 7 strips whitespace between elements with JSX rules (`compressHTML: 'jsx'`). Add `{" "}` between inline elements that need a space
- Astro Content Collections with Zod schema validation
- MDX support with custom component overrides (headings, images, mermaid, pills)
- Reading time estimation
- Safari Reader drops a `div` whose class or id matches words like `link`, `meta` or `share`, or whose text is under 25 characters. Wrap short blocks in a `p` or a custom element instead
- OG/Twitter metadata per post

### ViewTransitions
- Smooth page transitions via `astro:transitions`
- Astro's `prefetch` is off. `PageLoader.astro` fetches internal pages into memory as their links enter the viewport and serves ClientRouter navigations from that cache. Cloudflare serves HTML with `max-age=0, must-revalidate` and no `ETag`, so an HTTP-cache prefetch is downloaded again on click. Pages build as `about.html` (`build.format: "file"`, `trailingSlash: "never"`), so Cloudflare serves them at `/about` and 307s `/about/` there. Link without a trailing slash
- If the page is not ready 100ms after a click, `PageLoader` replaces the `[data-page-content]` slot in `Site.astro` (or the whole body on the home page) with a skeleton shaped like the destination
- Scripts re-initialize via `astro:after-swap` event

## Configuration Files
- `astro.config.mjs` - Astro config with MDX, React, Tailwind, Sätteri hast plugins
- `tsconfig.json` - Extends astro/tsconfigs/strict
- `src/content.config.ts` - Content collections (`blog`, `about`)

## Content Guidelines
- Blog posts go in `src/content/blog/` as `.md` or `.mdx` files
- Frontmatter must include `title` and `date`; `description`, `shareImage`, and `reviewers` are optional
- Images in `src/assets/posts/images/`, referenced in MDX as `<Image src="/posts/images/<file>">`. A missing file fails the build
- Add `priority` to above-the-fold images, and `sizes` to images narrower than the post column
- Never put images in `public/`: Astro copies them unoptimized and `pnpm check:images` fails CI
- About page content in `/content/about/`

# Workflow
When making changes:
1. Test locally with `pnpm dev`
2. Build for production with `pnpm build`
3. Checkout your own branch for changes and commit to it
4. Push changes and create a pull request for review
