# lemonkai.github.io

Astro-based personal technical blog for **KAI K8s之路 / KAI's K8s Journey**.

The site is built as a static export and deploys to GitHub Pages from this repository. The content model now supports:

- a bilingual core series (Chinese + English)
- short operational notes
- incident-style posts and production lessons

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
- `src/content/blog/zh/`: Chinese posts
- `src/content/blog/en/`: English posts
- `src/content/config.ts`: content collection schema
- `src/styles/global.css`: site-wide styling
- `.github/workflows/deploy.yml`: GitHub Pages deployment workflow

## Adding a post

1. Create a new Markdown file under `src/content/blog/zh/` or `src/content/blog/en/`.
2. Add frontmatter using this shape:

```md
---
title: Example title
description: One-sentence summary for cards, SEO, and RSS.
pubDate: 2026-04-28
updatedDate: 2026-04-28
lang: zh
kind: series
series: KAI K8s之路 / KAI's K8s Journey
seriesOrder: 1
translationKey: kai-k8s-road-01
tags:
  - kubernetes
  - observability
draft: false
---
```

3. Write the post body in Markdown. Code fences are syntax highlighted automatically.
4. For bilingual series posts, create matching `zh` and `en` entries with the same `translationKey`.
5. Use `kind: note` or `kind: incident` for side posts that are not part of the main series.
6. Run `npm run build` before pushing.

## GitHub Pages

The GitHub Actions workflow builds the Astro site and uploads `dist/` to Pages on pushes to `main`.
