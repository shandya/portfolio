# Portfolio

Next.js 14 portfolio site with a small password-protected CMS (`/cms`). Data comes from the `portfolio-be` API.

## Setup
Copy `.env.example` to `.env.local`, fill it in, then `npm install && npm run dev`.

## Scripts
`dev`, `build`, `start`, `lint`, `test`, `storybook`

## CMS auth
Signing in sets an HMAC-signed, expiring `cms_session` cookie (needs `CMS_SESSION_SECRET`). Middleware verifies it for `/cms/*`, and every server action re-verifies it before calling the backend with `BACKEND_ADMIN_KEY`.

## Data fetching
Public pages use `apiGet` (`src/lib/api.ts`), cached for 5 minutes and revalidated by tag whenever the CMS saves a change. The CMS itself reads uncached (`apiGetFresh`, or `apiGetAdmin` for admin-only endpoints such as draft posts).

## Blog
Posts are written in `/cms/posts` with the rich-text editor and stored by the API. Drafts stay private; publishing makes a post appear on `/blog`, the homepage "Writing" section, the sitemap and the RSS feed (`/blog/rss.xml`) right away.

## SEO
Set `NEXT_PUBLIC_SITE_URL` to the production URL. It drives canonical URLs, `sitemap.xml`, `robots.txt`, RSS links and OpenGraph images (`/opengraph-image`, `/blog/[slug]/opengraph-image`). Pages also emit schema.org JSON-LD (`Person` on the homepage, `BlogPosting` on posts).
