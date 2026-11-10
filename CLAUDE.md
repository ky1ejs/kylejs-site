# Kyle's Personal Site - Development Guide

## Project Overview
An Astro personal website/blog built with TypeScript, Tailwind CSS, and MDX for content management. The site features a modern design with dark/light theme support and is optimized for performance with zero JavaScript shipped by default (React islands used only where interactivity is needed).

## Technology Stack
- **Framework**: Astro 7 (static output, Rust compiler, Vite 8)
- **Runtime**: Node.js 24.21.0 (`.nvmrc`; CI and Cloudflare Workers Builds read it). Astro needs >= 22.23.4; 24.21.0 is preinstalled on Cloudflare's build image, so builds skip the Node download
- **Cloud sessions**: the container's default Node is 22.22.0, too old for Astro. `.claude/hooks/session-start.sh` installs the `.nvmrc` version with nvm and puts it on PATH for every Bash command. If `node -v` is not 24.21.0, run `source /opt/nvm/nvm.sh && nvm use` once; do not debug further
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
- `pnpm check:spelling` - Spell check content, components and docs with cspell (US and UK English). Add real words it does not know to `words` in `cspell.config.yaml`
- `pnpm knip` - Find unused files, dependencies and exports (runs in CI with lint)
- `pnpm check:images` - After a build, fail on images in `public/` or built images over 400 KB
- `pnpm check:layout-shift` - After a build, load every page and navigate between pages in a phone-sized Chromium on a slow network. Fails on layout shift, or on text a script rewrites after it is painted
- `pnpm check:back-navigation` - After a build, land on a page, follow a link, then go back and forward in a phone-sized Chromium on a slow network. Fails if a page the reader has already seen shows the loading skeleton
- `pnpm test` - Vitest: design token contrast and CSS sync, component markup
- `pnpm storybook` - Browse the design system at http://localhost:6006
- `pnpm build-storybook` then `pnpm test:design` - axe accessibility checks on every story in both themes, plus screenshot comparisons once reference images exist (see `tests/design/README.md`)

## Project Structure

### Pages (`/src/pages`)
- `index.astro` - Home page: hero, selected work (projects with `highlight`), area rail, then each area from the `areas` collection as a full band or a compact card
- `projects.astro` - Projects grouped by `src/lib/project-groups.ts`
- `about.astro` - About page with bio toggle
- `posts/index.astro` - Blog listing
- `posts/[id].astro` - Individual blog post (dynamic route)

### Layouts (`/src/layouts`)
- `Base.astro` - Root HTML layout with theme script, SEO meta, ViewTransitions
- `Site.astro` - Site layout with header nav, footer
- `Post.astro` - Post layout wrapping Site with `.post` class

### Content (`/src/content`)
- `blog/` - MDX/MD blog posts (frontmatter: title, description?, date, shareImage?, reviewers?, areas?). `areas` lists area IDs (file names in `areas/`); the post shows under each on the home page. An unknown ID fails the build. Projects take the same field
- `drafts/` - Draft blog posts
- `areas/` - One file per area on the home page. Layout is content: `display: band | compact`, `order`, `media.layout: side | stack`. An image without `src` renders as a labelled placeholder; photos go in `src/assets/areas/` with `src` relative to the area file. `items` is for things that are neither posts nor projects (a print, say): posts and projects join an area through their own `areas` field. A band lists ranked projects, then posts newest first, then other projects (active first), then `items`
- `projects/` - One file per project for /projects (group, repo, url, status, order, highlight?, areas?; optional body becomes a note). `highlight` ranks a project in the home page's selected work, 1 first; omit it to leave the project off. Two projects with the same rank fail the build

### Design system (`/src/design`)
Framework-agnostic: plain CSS plus React components that only take props and return markup. Astro renders them to HTML at build time, so they ship no JavaScript. Design source: the "kylejs.me design system" canvas on claude.ai.
- `tokens.ts` - Source of truth for colour, type, space and radius. `tokens.css` declares the same values as `--ks-*` custom properties; `tokens.test.ts` fails if they drift or if a text colour drops below 4.5:1
- `components.css` - `.ks-*` component classes on the tokens. `prose.css` - post body styles (`.post`)
- `marks.ts` - The ten area marks as `{ shape, detail }` paths on a 24 grid
- `callouts.ts` - Callout types and line icons, shared by the `Callout` component and `hast-callouts.ts`
- `components/` - Mark, Button, Pill and PillList, Chain, Byline, PostListItem, Callout, AreaCard, AreaBand and MediaPlaceholder, AreaRail, ProjectCard, ProjectItem, SiteHeader, SiteFooter, SocialLinks. `index.ts` is the public API
- `socials.ts` - The social profiles and their brand icons, used by the footer and home page
- `stories/` - Storybook stories. Storybook shows each story in light and dark: side by side from 900px wide, stacked for stories with `themeLayout: "stack"`

Rules for design-system components: no hooks or state (interactive pieces stay separate islands); no `astro:assets` (Astro pages call `getImage()` and pass `src`/`srcSet`); styles go in `components.css`, not Tailwind classes in markup. Use them from `.astro` files without a `client:` directive. Pass Astro content into them with named slots (`<Fragment slot="meta">`), which arrive as props. Astro passes a slot even when its content is empty, so render the component without the slot when there is nothing to put in it (see `index.astro` and `projects.astro`).

`Site.astro` takes `width="text"` (680px, default) or `width="wide"` (1120px, the home page).

### Components (`/src/components`)
- `.astro` components - PageLoader (page prefetch cache and loading skeleton, rendered by `Base.astro`), MermaidDiagram (hydrates Mermaid with `client:idle`), ThemeButton, PostMetadata (renders the design-system Byline), PostHeader, PostFooter, RelativeDateLabel, HeadingLinks (copies a heading's URL when its link is clicked)
- `.tsx` React components - Mermaid (client:idle), Pill (MDX override, renders the design-system Pill), GitHubRepoCard, DownloadFile, MdxImage

### Library (`/src/lib`)
- `reading-time.ts` - Reading time calculation
- `area-entries.ts` - Groups posts and projects by their `areas` frontmatter for the home page; throws on an unknown area
- `hast-heading-ids.ts` - Sätteri hast plugin for heading anchor IDs (keeps existing anchors stable; Astro's built-in slugger would change them)
- `hast-callouts.ts` - GitHub-style callout blockquotes
- `hast-heading-marks.ts` - Wraps each h2's content in `<span class="heading-mark">` for the highlighter style
- `hast-heading-links.ts` - Adds a copy-link anchor beside each heading with an ID (React components in MDX overrides are never hydrated, so this is done at build time)
- `hast-footnote-ref-separators.ts` - Comma between adjacent footnote refs
- `hast-mermaid-blocks.ts` - Mermaid code block → `<Mermaid>` component in MDX (needs `mermaid` in `syntaxHighlight.excludeLangs`)

### About Content (`/content/about`)
- `intro.mdx`, `professional.mdx`, `personal.mdx` - `about` content collection, rendered by `about.astro` with `render()` through the same Sätteri pipeline and component overrides as blog posts

### Styling
- **Global CSS**: `src/styles/global.css` imports Tailwind v4, the fonts and the design-system CSS, and sets base styles
- **Dark Mode**: `data-theme` attribute with `@variant dark` in Tailwind. The token selectors match any element, so a subtree can render in the other theme
- **Color System**: twelve `--ks-*` colour tokens per theme in `src/design/tokens.css`, plus a foreground and background for each of the four callout types. Tailwind gets the twelve as `paper`, `surface`, `ink`, `ink-2`, `muted`, `rule`, `accent`, `accent-text`, `accent-soft`, `on-soft`, `on-accent` and `accent-hover` (`bg-paper`, `text-ink`, `border-rule`…). There are no colour ramps; don't add `primary-500`-style shades
- **Fonts**: Lexend (headings, wordmark) and JetBrains Mono (labels, metadata) via Fontsource; body text uses the system font. `Base.astro` preloads Lexend on every page

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
- Set anything that depends on the reader (relative dates, theme, viewport) before paint: in CSS, or in an inline script beside the element plus an `astro:before-swap` handler on the incoming document (see `RelativeDateLabel.astro` and `Base.astro`). A module script or `astro:after-swap` handler can run after paint, and `pnpm check:layout-shift` fails on the shift
- Safari Reader drops a `div` whose class or id matches words like `link`, `meta` or `share`, or whose text is under 25 characters. Wrap short blocks in a `p` or a custom element instead
- OG/Twitter metadata per post

### ViewTransitions
- Smooth page transitions via `astro:transitions`
- Astro's `prefetch` is off. `PageLoader.astro` fetches internal pages into memory as their links enter the viewport and serves ClientRouter navigations from that cache. Cloudflare serves HTML with `max-age=0, must-revalidate` and no `ETag`, so an HTTP-cache prefetch is downloaded again on click. Pages build as `about.html` (`build.format: "file"`, `trailingSlash: "never"`), so Cloudflare serves them at `/about` and 307s `/about/` there. Link without a trailing slash
- `PageLoader` also keeps each page the reader has seen, starting with the one they landed on, reading the browser's copy with `fetch(..., { cache: "force-cache" })`. Going back or forward to it needs no request and shows no skeleton. `pnpm check:back-navigation` fails if it does
- If the page is not ready 100ms after a click, `PageLoader` replaces the `[data-page-content]` slot in `Site.astro` with a skeleton shaped like the destination
- Scripts re-initialize via `astro:after-swap` event

## Configuration Files
- `astro.config.mjs` - Astro config with MDX, React, Tailwind, Sätteri hast plugins
- `tsconfig.json` - Extends astro/tsconfigs/strict
- `src/content.config.ts` - Content collections (`blog`, `about`, `projects`, `areas`)

## Content Guidelines
- Blog posts go in `src/content/blog/` as `.md` or `.mdx` files
- Frontmatter must include `title` and `date`; `description`, `shareImage`, `reviewers` and `areas` are optional
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
