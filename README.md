# kylejs.me

Personal website and blog built with [Astro](https://astro.build).

## Tech Stack

- **Framework**: [Astro 7](https://astro.build) (static output)
- **Language**: TypeScript
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com) (CSS-first config)
- **Content**: MDX / Markdown via Astro Content Collections
- **UI Islands**: React (interactive components only — zero JS shipped by default)
- **Image Processing**: Sharp
- **Deployment**: Cloudflare Pages

## Getting Started

**Prerequisites**: Node.js 24 (see `.nvmrc`) and [pnpm](https://pnpm.io)

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
├── lib/                # Utilities & custom Sätteri hast plugins
└── styles/             # Global CSS with theme variables

content/about/          # About page content (MDX, `about` collection)
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

The site is deployed to **Cloudflare Workers** as a static assets Worker —
`wrangler.jsonc` points the Worker at the `dist/` build output.

Production deploys run through [Workers Builds](https://developers.cloudflare.com/workers/ci-cd/builds/git-integration/),
Cloudflare's Git integration, which is connected to this repository and builds
every push to `main`. The Actions workflows lint (`lint.yaml`) and build
(`build.yaml`) on push/PR to `main` as a check, and `preview.yaml` handles PR
previews.

### PR previews

`preview.yaml` builds each pull request and deploys it as a
[Worker Preview](https://developers.cloudflare.com/workers/previews/) named
`pr-<number>` under the `kylejs-site` Worker. It then posts one comment on the
PR with two links, and updates that comment on every push:

| Link | Points at | Use it for |
|---|---|---|
| **This PR** | Latest push to the PR | Sharing a link that stays current as you push |
| **This commit** | One specific deployment, immutable | Comparing two builds of the same PR |

The PR link looks like `https://pr-<number>-kylejs-site.k-830.workers.dev`.

A Preview gets no production traffic, so opening one never affects the live
site. When the PR closes or merges, the same workflow deletes the Preview and
all its deployments.

The workflow needs the `CLOUDFLARE_API_TOKEN` and `CLOUDFLARE_ACCOUNT_ID`
repository secrets. Workers Builds' own preview builds are turned off: each one
left a preview alias on the Worker that kept serving after its PR closed, and
an alias can't be deleted.
