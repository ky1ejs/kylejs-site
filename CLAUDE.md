# Kyle's Personal Site - Development Guide

## Project Overview
An Astro personal website/blog built with TypeScript, Tailwind CSS, and MDX for content management. The site features a modern design with dark/light theme support and is optimized for performance with zero JavaScript shipped by default (React islands used only where interactivity is needed).

## Technology Stack
- **Framework**: Astro 6 (static output)
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4 (CSS-first config via @tailwindcss/vite)
- **Package Manager**: pnpm
- **Content**: Astro Content Collections with MDX
- **Image Processing**: Sharp (via astro:assets)
- **UI Islands**: React (for Mermaid diagrams and interactive components)

## Available Scripts
- `pnpm dev` - Start development server
- `pnpm build` - Build for production (static output to `dist/`)
- `pnpm preview` - Preview production build locally
- `pnpm lint` - Run ESLint
- `pnpm lint:fix` - Run ESLint with auto-fix

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
- `.astro` components - ThemeButton, PostMetadata, PostHeader, PostFooter, Copyright, RelativeDateLabel
- `.tsx` React components - Mermaid (client:idle), HeadingWithLink (MDX override), Pill, GitHubRepoCard, DownloadFile, MdxImage, Bio, Selector

### Library (`/src/lib`)
- `reading-time.ts` - Reading time calculation
- `rehype-heading-ids.ts` - Custom rehype plugin for heading anchor IDs
- `rehype-callouts.ts` - GitHub-style callout blockquotes
- `rehype-mermaid-blocks.ts` - Mermaid code block → component conversion

### About Content (`/content/about`)
- `intro.md`, `professional.mdx`, `personal.md` - Compiled at build time with MDX

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
- Astro Content Collections with Zod schema validation
- MDX support with custom component overrides (headings, images, mermaid, pills)
- Reading time estimation
- OG/Twitter metadata per post

### ViewTransitions
- Smooth page transitions via `astro:transitions`
- Scripts re-initialize via `astro:after-swap` event

## Configuration Files
- `astro.config.mjs` - Astro config with MDX, React, Tailwind, rehype plugins
- `tsconfig.json` - Extends astro/tsconfigs/strict
- `src/content.config.ts` - Content collection schemas

## Content Guidelines
- Blog posts go in `src/content/blog/` as `.md` or `.mdx` files
- Frontmatter must include `title` and `date`; `description`, `shareImage`, and `reviewers` are optional
- Images in `/public/posts/images/`
- About page content in `/content/about/`

# Workflow
When making changes:
1. Test locally with `pnpm dev`
2. Build for production with `pnpm build`
3. Checkout your own branch for changes and commit to it
4. Push changes and create a pull request for review
