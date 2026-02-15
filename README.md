# T.E.T. Mfg. Co., Inc. — Astro Site

Static Astro website for T.E.T. Mfg. Co., Inc. (precision manufacturing job shop). Built for **Cloudflare Pages** with a secure, static-only setup: no server-side code, no admin, no CMS.

---

## 📝 For Content Editors

**Non-technical users:** See **[EDITING_GUIDE.md](./docs/EDITING_GUIDE.md)** for step-by-step instructions on updating services and facilities using GitHub's web interface.

---

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
- **Syncing env to Cloudflare:** The `npm run sync-env` script pushes variables from `.env` and `.env.local` to Cloudflare Pages. Put **local-only** values in `.env.local` (do not commit): `CLOUDFLARE_ACCOUNT_ID` (your Cloudflare account ID) and `CLOUDFLARE_API_TOKEN` (token with Pages:Edit). Those two are never sent to Cloudflare; only the rest are synced. See `.env.example` for a template.

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

## Editing Services and Facilities (Non-Technical Users)

Services and facilities data are stored in easy-to-edit JSON files. You can update these files directly on GitHub without needing to code:

### How to Edit via GitHub Web Interface

1. **Navigate to the content files:**
   - Services: `src/content/services/`
   - Facilities: `src/content/facilities/`

2. **Click on the file you want to edit** (e.g., `production-runs.json` or `cnc-milling.json`)

3. **Click the pencil icon (Edit this file)** in the top-right of the file view

4. **Make your changes:**
   - For services: update `title`, `description`, or `icon`
   - For facilities: update `category`, `description`, or add/remove items from the `items` array
   - Keep the JSON format intact (quotes, commas, brackets)

5. **Preview your changes** using the "Preview" tab

6. **Commit your changes:**
   - Scroll down to "Commit changes"
   - Add a brief description (e.g., "Updated CNC Milling equipment list")
   - Click "Commit changes"

7. **Cloudflare Pages will automatically rebuild** your site with the new content (takes 1-2 minutes)

### Services Files

Each service is a separate JSON file in `src/content/services/`:
- `production-runs.json`
- `prototyping.json`
- `custom-jobs.json`

**Fields:**
- `title`: Service name
- `icon`: Icon name (mill, wrench, clipboard, gear, etc.)
- `description`: Service description
- `order`: Display order (1, 2, 3...)

### Facilities Files

Each facility category is a separate JSON file in `src/content/facilities/`:
- `cnc-milling.json`
- `cnc-turning.json`
- `surface-grinding.json`
- And more...

**Fields:**
- `category`: Category name (e.g., "CNC Milling")
- `icon`: Icon name (mill, gear, wrench, caliper, clipboard)
- `order`: Display order (1-9)
- `description`: Optional description text
- `items`: Array of equipment items (can be empty `[]`)

**Example:**
```json
{
  "category": "CNC Milling",
  "icon": "mill",
  "order": 1,
  "items": [
    "2010 MORI SEIKI NMV 5000 5-Axis, 5 Pallet Vertical",
    "2009 OKUMA HOWA 761V 30″ × 60″ table"
  ]
}
```

### Adding a New Service or Facility

1. Create a new `.json` file in the appropriate directory
2. Copy the structure from an existing file
3. Update the values
4. Set the `order` field to control where it appears on the page
5. Commit the file

## Configuration

Sensitive values (phone, email parts) are read from **environment variables** at build time. See **Environment variables / secrets** above. The repo only contains fallbacks for local development.

## Security notes

- No admin, login, or CMS.
- Phone and email parts can be set only in Cloudflare Pages (or local `.env`); the repository need not contain real values.
- Email and phone are still assembled client-side in the browser to reduce scraping.
- External links use `rel="noopener noreferrer"`.
- No secrets committed; use Cloudflare **Secrets** (encrypted env vars) for production.
- **Headers:** `public/_headers` sets security headers (X-Frame-Options, X-Content-Type-Options, Referrer-Policy) and cache rules for Cloudflare Pages.

## SEO

- Meta description and canonical URL per page
- Sitemap via `@astrojs/sitemap` (generated at build)
- Semantic HTML and clear headings
