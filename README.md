# T.E.T. Mfg. Co., Inc. — Astro Site

Static Astro website for T.E.T. Mfg. Co., Inc. (precision manufacturing job shop). Built for **Cloudflare Pages** with a secure, static-only setup: no server-side code, no admin, no CMS.

## Tech stack

- **Astro** (latest) with TypeScript
- **Tailwind CSS** (utility-first, industrial palette)
- **Static output** — no adapters; build outputs plain HTML/CSS/JS to `./dist`

## Local development

```bash
npm install
npm run dev
```

Open [http://localhost:4321](http://localhost:4321).

## Build

```bash
npm run build
```

Output is written to **`./dist`**.

## Deploy on Cloudflare Pages

1. **Build command:** `npm run build`  
2. **Build output directory:** `dist`  
3. **Root directory:** project root (leave blank if repo root is the project).

### Environment variables / secrets (recommended)

To keep phone, email, and form URL **out of the repository**, set these in Cloudflare Pages at **Settings → Environment variables** (or **Secrets** for sensitive values). They are read at **build time** and baked into the static output; they are not exposed in the client bundle.

| Variable | Description | Example |
|----------|-------------|--------|
| `TET_PHONE` | Phone number shown on contact page | `860-349-1004` |
| `TET_EMAIL_USER` | Email local part (before @) | `info` |
| `TET_EMAIL_DOMAIN` | Email domain (after @) | `tetmfg.com` |
| `CLOUDFLARE_ANALYTICS_TOKEN` | Cloudflare Web Analytics beacon token (optional) | From Cloudflare dashboard → Web Analytics |

- **Secrets** (encrypted): Use for `TET_PHONE`. In the dashboard: **Settings → Environment variables** → **Encrypt** when adding.
- **Production vs Preview**: Set variables for **Production** and optionally for **Preview**.
- **Local dev:** Copy `.env.example` to `.env` and fill in (do not commit `.env`). Fallbacks in `src/config/site.ts` allow the site to build without env set.

### Before you go live

- Set `TET_PHONE` and optionally `TET_EMAIL_USER` / `TET_EMAIL_DOMAIN` in Cloudflare Pages so the live site shows real values and the repo stays free of identifying data.
- **Cloudflare Web Analytics:** In Cloudflare dashboard, add your site under Web Analytics and copy the beacon token into `CLOUDFLARE_ANALYTICS_TOKEN`. The script is only injected when this variable is set.
- **Open Graph image:** The site uses `public/og-image.svg` (1200×630) for social link previews. For best compatibility with all platforms, replace with a 1200×630 PNG at `public/og-image.png` and pass `image="/og-image.png"` from key pages if needed.

## Project structure

```
tetmfg-site/
├── public/           # Static assets (favicon, etc.)
├── src/
│   ├── components/   # Header, Footer, ObfuscatedContact
│   ├── config/       # site.ts (phone, email domain)
│   ├── content/      # Content collections (markdown)
│   │   ├── config.ts # Collection schemas (e.g. pages)
│   │   └── pages/    # .md files → /md/<slug>
│   ├── layouts/      # BaseLayout.astro
│   ├── pages/        # index, facilities, services, quality, contact, md/[...slug]
│   └── styles/       # global.css (Tailwind)
├── astro.config.mjs
├── tailwind.config.mjs
├── tsconfig.json
└── package.json
```

## Markdown content

You can add markdown pages that are built at **`/md/<slug>`**. Add `.md` files under `src/content/pages/` (no example file is included).

1. **Add a file** under `src/content/pages/`, e.g. `src/content/pages/about.md`.
2. **Frontmatter** (required): `title`, and optionally `description`, `draft: true` (draft pages are excluded from the build).
3. **URL:** The file `about.md` becomes `/md/about`. Nested files like `info/team.md` become `/md/info/team`.

Example:

```markdown
---
title: About Us
description: Our company history and team.
---

This is **markdown** body content.
```

To add more collections (e.g. capabilities, services as data), define them in `src/content/config.ts` and use `getCollection()` / `getEntry()` in your components or pages.

## Configuration

Sensitive values (phone, email parts) are read from **environment variables** at build time. See **Environment variables / secrets** above. The repo only contains fallbacks for local development.

## Security notes

- No admin, login, or CMS.
- Phone and email parts can be set only in Cloudflare Pages (or local `.env`); the repository need not contain real values.
- Email and phone are still assembled client-side in the browser to reduce scraping.
- External links use `rel="noopener noreferrer"`.
- No secrets committed; use Cloudflare **Secrets** (encrypted env vars) for production.

## SEO

- Meta description and canonical URL per page
- Sitemap via `@astrojs/sitemap` (generated at build)
- Semantic HTML and clear headings
