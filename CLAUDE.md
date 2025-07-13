# Kyle's Personal Site - Development Guide

## Project Overview
A Next.js personal website/blog built with TypeScript, Tailwind CSS, and MDX for content management. The site features a modern design with dark/light theme support and is optimized for performance.

## Technology Stack
- **Framework**: Next.js with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Package Manager**: pnpm
- **Content**: MDX with gray-matter for frontmatter
- **Analytics**: Vercel Analytics & Speed Insights
- **Image Processing**: Sharp for optimization, plaiceholder for blurred placeholders

## Available Scripts
- `pnpm dev` - Start development server
- `pnpm build` - Build for production
- `pnpm start` - Start production server
- `pnpm lint` - Run ESLint
- `pnpm lint:fix` - Run ESLint with auto-fix

## Project Structure

### App Directory (`/app`)
- Uses Next.js 13+ App Router
- Root layout in `app/layout.tsx` with theme provider and analytics
- Site-specific layout in `app/(site)/layout.tsx` with navigation
- Pages: home (`page.tsx`), about (`/about`), posts (`/posts`)

### Content Management
- **Posts**: MDX files in `/posts` directory
- **About content**: Markdown/MDX files in `/content/about`
- **Images**: Stored in `/public/posts/images`

### Components (`/components`)
- Modular React components with TypeScript
- Theme system with `Theme/` subdirectory
- Custom components for blog functionality (PostHeader, PostFooter, etc.)

### Library Functions (`/lib`)
- `posts.ts` - Blog post data fetching and processing
- `markdown-compile.tsx` - MDX compilation utilities
- `reading-time.ts` - Reading time calculation
- `rehype-*` - Custom rehype plugins for markdown processing

### Styling
- **Tailwind Config**: Custom color system using CSS variables
- **Dark Mode**: Class-based with `data-theme` attribute support
- **Custom CSS**: Global styles in `app/globals.css` and component-specific styles

## Key Features

### Theme System
- Light/dark mode toggle
- Preference stored in cookies
- System preference detection
- CSS variable-based color system

### Blog Functionality
- MDX support with custom components
- Image optimization with size detection
- Reading time estimation
- Post metadata handling

### Performance Optimizations
- Sharp for image processing
- Vercel Analytics integration
- Optimized SVG handling with @svgr/webpack

## Development Workflow
1. Run `pnpm dev` to start development server
2. Add new posts as `.mdx` files in `/posts` directory
3. Use `pnpm lint` to check code quality
4. Build with `pnpm build` before deployment

## Configuration Files
- `next.config.js` - SVG loader configuration
- `tailwind.config.js` - Custom color system and content paths
- `tsconfig.json` - TypeScript configuration with path aliases
- `postcss.config.js` - PostCSS setup for Tailwind

## Content Guidelines
- Blog posts use MDX format with frontmatter
- Images should be optimized and placed in `/public/posts/images`
- About page content is modular in `/content/about`

# Workflow
When making changes:
1. Ensure code is linted with `pnpm lint`
2. Test locally with `pnpm dev`
3. Build for production with `pnpm build`
4. Checkout your own branch for changes and commit to it
5. Push changes and create a pull request for review
