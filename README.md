# lemonkai.github.io

Astro-based personal technical blog focused on Kubernetes, AI agents, and infrastructure notes. The site is built as a static export and deploys to GitHub Pages from this repository.

## Stack

- Astro static site
- Astro content collections for posts
- RSS feed via `@astrojs/rss`
- Sitemap via `@astrojs/sitemap`

## Local development

```bash
npm install
npm run dev
```

The dev server runs on `http://localhost:4321` by default.

## Production build

```bash
npm run build
```

The generated site is written to `dist/`.

## Project structure

- `src/pages/`: route files for the homepage, blog, tags, and about page
- `src/layouts/`: shared document layout
- `src/components/`: reusable UI components
- `src/content/blog/`: Markdown posts
- `src/content/config.ts`: content collection schema
- `src/styles/global.css`: site-wide styling
- `.github/workflows/deploy.yml`: GitHub Pages deployment workflow

## Adding a post

1. Create a new Markdown file under `src/content/blog/`.
2. Add frontmatter using this shape:

```md
---
title: Example title
description: One-sentence summary for cards, SEO, and RSS.
pubDate: 2026-04-28
updatedDate: 2026-04-28
tags:
  - kubernetes
  - observability
draft: false
---
```

3. Write the post body in Markdown. Code fences are syntax highlighted automatically.
4. Run `npm run build` before pushing.

## GitHub Pages

The GitHub Actions workflow builds the Astro site and uploads `dist/` to Pages on pushes to `main`.
