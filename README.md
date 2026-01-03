# BTrustOn — Professional Next.js + SEO (legacy SPA preserved)

## What you get
- `/` : Server-rendered (SSR) directory / investor landing
- `/company/[slug]` : SSR company pages (Google-indexable)
- `/sitemap.xml` and `/robots.txt`
- `/app` : Your existing SPA **unchanged** (served from `/public/app/index.html`)

## IMPORTANT
Move your existing `i18n/*.json` files into: `public/app/i18n/`
so your SPA can load them via `/app/i18n/...`.

## Env vars (Vercel)
- `SITE_URL` (e.g. https://btruston.com)
- `SUPABASE_URL`
- `SUPABASE_ANON_KEY`
- (optional) `SUPABASE_SERVICE_ROLE_KEY`
