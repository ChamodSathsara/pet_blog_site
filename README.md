# Grey Muzzle Guide — Next.js

This is the Next.js (App Router) rebuild of the original Vite + React Router SPA.

## Database and admin setup

Create a git-ignored `.env.local` with `DATABASE_URL`, `AUTH_SECRET`, `ADMIN_EMAIL`, `ADMIN_PASSWORD`, and optionally `BLOB_READ_WRITE_TOKEN`. Then run:

```bash
npm install
npm run db:generate
npm run db:migrate
npm run db:seed
```

Start the app and visit `/admin`; sign in with `ADMIN_EMAIL` and `ADMIN_PASSWORD`. Production image uploads require a Vercel Blob read/write token. Local development falls back to `public/uploads`. Published post and category pages use 60-second ISR.

## Run it

```bash
npm install
npm run dev      # http://localhost:3000
npm run build && npm start   # production build
```

Update `SITE_URL` in `lib/seo.ts` to your real domain before deploying — sitemap, canonical URLs, and Open Graph tags all derive from it.

## What changed vs. the original SPA, and why it's more SEO-friendly

**1. Server-rendered `<head>` tags instead of client-side `document.head` mutation.**
The original `useSeo` hook set `document.title` and meta tags with `useEffect` after the page mounted — a crawler or social-media unfurler that doesn't execute JavaScript sees nothing. Every route now exports Next.js `Metadata` (`generateMetadata` for dynamic routes), which Next renders into the initial HTML response. See `lib/seo.ts`.

**2. Static generation for every post and category page.**
`app/blog/[slug]/page.tsx` and `app/category/[category]/page.tsx` use `generateStaticParams`, so each page is pre-rendered to static HTML at build time — fast, fully crawlable, and cacheable at the edge, instead of a client-side route match against `react-router`.

**3. Structured data (JSON-LD).**
Added `Article`, `WebSite`, and `BreadcrumbList` schema (`lib/seo.ts` + `components/JsonLd.tsx`) that didn't exist in the SPA. This is what enables rich results (author, publish date, breadcrumbs) in Google search.

**4. `sitemap.xml` and `robots.txt`.**
`app/sitemap.ts` and `app/robots.ts` generate these automatically from your posts/categories data — the SPA had neither.

**5. Canonical URLs + Open Graph + Twitter Cards on every page**, including per-article images, published dates, and author attribution — previously only partially set and only client-side.

**6. Optimized images.**
All `<img>` tags became `next/image`, which serves right-sized, modern-format (AVIF/WebP) images with lazy loading — a Core Web Vitals / page-experience ranking factor.

**7. Self-hosted, non-render-blocking fonts.**
Swapped the `@import url(fonts.googleapis.com...)` in the old CSS for `next/font/google`, which downloads and self-hosts the font files at build time and eliminates the extra render-blocking request + layout shift.

**8. Real URLs, real routing.**
`/blog/some-post` is now a real server route (works with JS disabled, direct links, `curl`, etc.), not a client-side-only match inside a single-page app shell.

## Structure

```
app/                     # routes (App Router)
  layout.tsx             # root layout, fonts, global <head> defaults, Header/Footer
  page.tsx               # home
  sitemap.ts / robots.ts # generated SEO files
  blog/page.tsx          # article index (+ BlogClient.tsx for filter UI)
  blog/[slug]/page.tsx   # article page (generateStaticParams + generateMetadata + JSON-LD)
  category/[category]/page.tsx
  about/ contact/ privacy-policy/ disclaimer/
components/              # shared UI (Header, Footer, PostCard, Markdown, etc.)
lib/
  data/                  # authors, categories, legal copy (unchanged content) — posts now live in the database, managed via /admin
  utils/                 # posts.ts, markdown.ts, cn.ts (unchanged logic)
  seo.ts                 # Metadata + JSON-LD builders (replaces the old useSeo hook)
```

## Adding a new post

After logging in, open `/admin` and create or publish the post with the Post Editor. Posts are written directly to the database; there is no file-based post workflow.
