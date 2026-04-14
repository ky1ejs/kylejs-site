# kylejs.me

Personal website and blog built with [Astro](https://astro.build).

## Tech Stack

- **Framework**: [Astro 6](https://astro.build) (static output)
- **Language**: TypeScript
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com) (CSS-first config)
- **Content**: MDX / Markdown via Astro Content Collections
- **UI Islands**: React (interactive components only — zero JS shipped by default)
- **Image Processing**: Sharp
- **Deployment**: Cloudflare Pages

## Getting Started

**Prerequisites**: Node.js 22 and [pnpm](https://pnpm.io)

```bash
pnpm install
pnpm dev
```

The dev server runs at `http://localhost:4321`.

## Scripts

| Command | Description |
|---|---|
| `pnpm dev` | Start development server |
| `pnpm build` | Build for production (output: `dist/`) |
| `pnpm preview` | Preview production build locally |
| `pnpm lint` | Run ESLint |
| `pnpm lint:fix` | Run ESLint with auto-fix |

## Project Structure

```
src/
├── pages/              # File-based routing
│   ├── index.astro     # Home page
│   ├── about.astro     # About page
│   └── posts/          # Blog listing & dynamic post routes
├── content/
│   ├── config.ts       # Content collection schema (Zod)
│   └── blog/           # Blog posts (MD/MDX)
├── components/         # Astro & React components
├── layouts/            # Base, Site, and Post layouts
├── lib/                # Utilities & custom rehype plugins
└── styles/             # Global CSS with theme variables

content/about/          # About page content (MD/MDX)
public/                 # Static assets (images, icons)
```

## Blog Posts

Blog posts live in `src/content/blog/` as `.md` or `.mdx` files.

**Frontmatter schema:**

| Field | Type | Required |
|---|---|---|
| `title` | string | yes |
| `date` | date | yes |
| `description` | string | no |
| `shareImage` | string | no |

## Deployment

The site is deployed to Cloudflare Pages. A GitHub Actions workflow runs on push/PR to `main`, which installs dependencies and runs `pnpm build`.
