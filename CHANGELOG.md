# Changelog

Format: [Keep a Changelog](https://keepachangelog.com/), [SemVer](https://semver.org/)

## [Unreleased]

### Added

### Changed
- **docs**: `.env.example` now includes `MONGODB_URI` and `MONGODB_DB` at the top with a header comment linking [MongoDB Atlas](https://www.mongodb.com/) and calling out the free M0 tier (500 MB, no credit card) — the previous example silently omitted the blog's most critical env var
- **docs**: README rewritten to reflect v4.3.0. Tech Stack adds MongoDB 7, unified/remark/rehype pipeline, Sharp, jspdf. Features list drops the deleted Matrix Rain / carousel / TextAnimation and adds the MongoDB-backed blog, editorial dark redesign, modern header, `/contact` + `/work-with-me` pages, `/api/health`, dynamic PDF resume, CSP + rate-limited contact form. Getting Started gains a 4-step onboarding flow including a dedicated "MongoDB Atlas setup" subsection, a post-seeding verification step via `/api/health`, and a "Brand assets" section documenting `scripts/generate-images.mjs`. Env var table prepended with `MONGODB_URI`/`MONGODB_DB` rows. Scripts table drops the stale `npm run sitemap` and adds `npm run typecheck`

### Fixed

## [4.3.0] - 2026-04-12

### Added
- **api**: New `/api/health` endpoint that runs a real MongoDB `ping` (3s timeout via `Promise.race`), audits 9 required env vars, and aggregates the result into a public-safe JSON response (`status`, `name`, `version`, `timestamp`). HTTP 200 on healthy, 503 on critical failure — uptime monitors can page on the status code. Per-check details (Mongo latency, missing env var names, driver error strings) are NOT echoed back to keep the endpoint public-safe. `Cache-Control: public max-age=30` short enough for post-deploy checks, long enough to avoid ping-bombing Atlas
- **lib**: New `src/lib/version.ts` — single source of truth that imports `package.json` via `resolveJsonModule` and exports `APP_VERSION`/`APP_NAME` as compile-time constants for both server and client code
- **ui**: Live health indicator + version badge in the Footer bottom bar. New `HealthIndicator` client component fetches `/api/health` once on mount (`cache: 'no-store'` to bypass browser disk cache) and renders a three-state dot: gray "checking", emerald with `animate-ping` halo when OK, red on error. Sits inside the version pill, which now links to `/api/health` in a new tab. Respects `prefers-reduced-motion`, full status in `aria-label`/`title` for screen readers
- **ui**: Redesigned Hero scroll-down indicator — replaced the plain white chevron circle with a three-chevron iOS-style cascade (stacked indigo chevrons that blink in sequence via the new `chevron-blink` keyframe) plus a "SCROLL" editorial eyebrow label. Respects `prefers-reduced-motion` and has a proper keyboard focus ring

### Changed
- **content**: Rewrote the Hero bio on the home page to remove the "Senior Full Stack Developer" duplicate (already carried by the eyebrow pill above). The subtitle now leads with the employment context ("Currently Head of Development & IT Infrastructure at Moon Holidays, leading the engineering team across every platform and product…") and the body paragraph switched to first-person ("I architect…") for tonal consistency with the rest of the site
- **content**: Rewrote `aboutData.description` in impersonal resume-summary voice (no first-person "I'm" and no third-person "George is"). The paragraph feeds both the home About section and the `/api/resume` PDF, so it now reads cleanly as a proper professional summary in both contexts. Adds an explicit "ten years of experience" seniority anchor for recruiter scanning

### Fixed
- **seo**: Append `?v=2` to every `/og-image.png` reference (layout, contact, work-with-me, tag archive) so WhatsApp / Facebook / LinkedIn / Slack link-preview scrapers treat it as a new cache key and fetch the updated 1200×630 branded banner instead of the old portrait that was cached at the same URL
- **ui**: HireHero "Open to new projects" eyebrow pill no longer collides with the `Home > Work with me` breadcrumb on mobile. Bumped top padding from `py-24` → `pt-32 sm:pt-36 lg:pt-44` so the pill always sits below the absolute-positioned breadcrumb strip
- **ui**: PageHero top padding bumped from `py-28` → `pt-32 sm:pt-36 lg:pt-44` to match HireHero's breadcrumb clearance pattern. Fixes the cramped 12px gap between the breadcrumb strip and the eyebrow pill on `/portfolio`, `/contact`, and `/portfolio/tag/[tag]` on mobile (now 28px safe clearance)
- **seo**: BreadcrumbList JSON-LD on `/contact`, `/work-with-me`, `/portfolio`, `/portfolio/[slug]`, and `/portfolio/tag/[tag]` no longer triggers "Unnamed item" warnings in strict Schema.org validators. New `src/lib/breadcrumb.ts` helper emits the nested-item form (`item: {@type: 'WebPage', @id, url, name}`) so every reachable path to `name` is populated — belt-and-suspenders both on the outer ListItem and the inner WebPage Thing

## [4.2.1] - 2026-04-11

### Fixed
- **build**: Track 87 favtech SVG icons that were blocked from git by a stale `src/images/favtech/.gitignore` — fixes Netlify "Module not found" errors for apache/astro/bun/drizzle/fly/gunicorn/hetzner/hono/jest/kafka/linear/mcp/minio/neon/nestjs/notion/opentelemetry/pm2/podman/prisma/radix/raycast/resend/sentry/shadcn/swagger/tanstack/turso/uvicorn/uwebsockets/valkey/vite/vitest and more. Local builds passed because the files were on disk.

## [4.2.0] - 2026-04-11

### Added
- **blog**: MongoDB-backed portfolio blog with dynamic /portfolio/[slug], /portfolio/tag/[tag], per-post opengraph-image generator, RSS feed, and llms.txt integration
- **blog**: Public vs Commercial portfolio split with featured posts, GitHub star enrichment, TOC, related posts, and editorial PostCard/PostRow components
- **blog**: scripts/seed-posts.mjs upserts 15 posts (8 open source + 7 commercial case studies)
- **pages**: Dedicated /contact page with ContactPage JSON-LD, two-column form layout, "Preferred: WhatsApp" card, and response-time copy
- **pages**: Dedicated /work-with-me page (replaces /hire-me via 301) with HireHero, Services, and ContactCTA
- **ui**: Modern header with usePathname active state, GK avatar, pill indicators, and mobile slide-in drawer
- **ui**: Shared PageHero and PageBreadcrumbs layout components used across landing pages
- **ui**: GridBackground animated canvas replacing MatrixBackground on Hero
- **ui**: Editorial dark redesign across About, Resume, GithubStats, FavoriteTech, Testimonials, and Footer
- **ui**: Vertical timeline rail in Resume Work with indigo dot markers and monospace meta
- **ui**: Multi-column editorial Footer with brand bio, Explore/Resources nav, and Back-to-top pill
- **security**: Content-Security-Policy header with scoped connect-src for google/emailjs/github and frame-ancestors 'none'
- **security**: IP-keyed in-memory rate limiter on /api/contact (5/min, 20/hour)
- **security**: typeof guards, RFC-lite email regex, and min/max length bounds on /api/contact
- **security**: reCAPTCHA v3 score >= 0.5 + action match verification on /api/contact
- **security**: Cache-Control: public, max-age=3600, s-maxage=3600 on /api/resume to neutralize DoS vector
- **tools**: scripts/generate-images.mjs — Sharp-based OG banner, PWA icons, and favicon generator from source profile + indigo palette
- **seo**: Per-post dynamic 1200x630 PNG OG images via Next.js ImageResponse
- **seo**: data-scroll-behavior="smooth" on <html> to silence Next 16 smooth-scroll warning

### Changed
- **brand**: Unified role copy across the site. Home and taglines use "Senior Full Stack Developer" (SEO speciality); "Head of Development & IT Infrastructure at Moon Holidays" now appears only in descriptions and JSON-LD jobTitle
- **seo**: All page titles follow "<Page> | George Khananaev" direction including home
- **seo**: Home page, /portfolio, /contact, /work-with-me, /portfolio/tag/[tag], and /portfolio/[slug] all emit consistent metadata, canonicals, and JSON-LD
- **seo**: Global og-image.png regenerated as 1200x630 branded banner (replaces portrait og-profile.jpg for OG/Twitter contexts)
- **seo**: /portfolio/[slug] no longer overrides openGraph.images so the dynamic PNG generator route takes over
- **seo**: Work-with-me description trimmed to ~156 chars for SERP snippets
- **seo**: Moon Holidays URL corrected from moonholidays.com to moonholidays.co.th across JSON-LD, Footer, PostFooter, and seed script
- **deps**: jspdf ^4.2.0 -> ^4.2.1 (patches CVSS 9.6 XSS + 8.1 PDF object injection)
- **deps**: next ^16.1.0 -> ^16.2.3 (patches DoS, CSRF bypass, HTTP smuggling, cache growth, resume buffer)
- **deps**: eslint ^10 -> ^9 (compatible with eslint-config-next v16 peer)
- **eslint**: Rewrote eslint.config.mjs to use eslint-config-next v16 native flat-config exports, dropping the FlatCompat shim that crashed on react-plugin's circular configs ref
- **build**: Replaced stale "next lint" npm script with "eslint src/**/*.{ts,tsx}" and added a "typecheck" script
- **pdf**: /api/resume now renders an editorial grid mesh in both the sidebar and main column and surfaces /portfolio in the sidebar links

### Fixed
- **a11y**: Post pages now consistently append "| George Khananaev" to titles even when MongoDB-seeded metaTitle omits the suffix
- **ui**: react-phone-number-input flags bundled locally via `react-phone-number-input/flags` so the country-code dropdown renders under the new strict CSP
- **seo**: Tag archive pages now emit openGraph.images + twitter.card: summary_large_image (were previously missing)
- **ui**: Dynamic opengraph-image.tsx route no longer returns empty responses — fixed a Satori two-child issue where `#{tag}` compiled to two JSX children without explicit display: flex on the parent
- **seo**: Canonical Moon Holidays domain (moonholidays.co.th) is now used consistently in place of the incorrect .com

### Removed
- **cleanup**: src/hooks/ directory (useNavObserver, useInterval, useWindow, useDetectOutsideClick) — all unused after the header rewrite
- **cleanup**: src/components/TextAnimation.tsx, MatrixBackground.tsx, and Sections/Portfolio.tsx — replaced by new design system
- **cleanup**: .prettierrc — formatting handled by prettier-plugin-tailwindcss via ESLint config
- **cleanup**: Unused SectionId enum entries (Skills, Stats, Testimonials, FavoriteTech), `contact.headerText` field, and `countWords`/`readingTimeMinutes` markdown helpers

## [4.1.0] - 2026-03-15

### Added
- **seo**: `/llms.txt` endpoint for AI crawler discoverability
- **seo**: Enriched JSON-LD with location, languages, education, occupation, and 30+ skills
- **seo**: Explicit AI bot permissions in robots.txt (GPTBot, ClaudeBot, PerplexityBot, etc.)

### Changed
- **perf**: Lighthouse score improved from 58 to 94 (TBT: 2,220ms → 0ms, Speed Index: 5.1s → 1.7s)
- **perf**: Lazy-load reCAPTCHA via IntersectionObserver (loads only when contact section visible)
- **perf**: Dynamic imports for below-fold sections (Portfolio, FavoriteTech, GithubStats, Testimonials, Contact)
- **perf**: Canvas animations pause when off-screen via IntersectionObserver
- **perf**: MatrixBackground uses requestAnimationFrame instead of setInterval
- **perf**: Added loading="lazy" and sizes to below-fold images
- **perf**: Enabled ISR with 1-hour revalidation
- **readme**: Restored Netlify deploy status badge

### Fixed
- **seo**: Replaced next-sitemap with Next.js built-in sitemap.ts and robots.ts (fixes 404 on Netlify)
- **ui**: Improved error pages contrast to WCAG AAA and added global-error handler

## [4.0.0] - 2026-03-14

### Added
- **seo**: OpenGraph, Twitter Card, and JSON-LD structured data metadata
- **seo**: Canonical URLs with language alternates and format detection
- **seo**: PWA icons (apple-touch-icon, icon-192, icon-512) and web manifest
- **seo**: OG image for social media sharing
- **app**: Custom 404 page with back-home navigation
- **security**: HTTP security headers (X-Frame-Options, HSTS, CSP, Referrer-Policy, Permissions-Policy)
- **tech**: Added monday.com to favorite technologies
- **tech**: 70 favorite technologies with category filtering (AI, Languages, Frameworks, Databases, Cloud, DevOps, Security, Services, Testing, Tools)
- **portfolio**: Dynamic star counts fetched from GitHub API with 1hr ISR cache
- **resume**: Dynamic PDF resume generation via `/api/resume` with two-column design
- **app**: Next.js 16 App Router with server and client components
- **github**: GitHub stats section with repo count, stars, followers, achievements, and top languages
- **portfolio**: Animated particle canvas backgrounds on portfolio cards
- **portfolio**: SVG illustrations for all 8 portfolio projects
- **contact**: Phone input with country code selector and WhatsApp support
- **contact**: Server-side API route for EmailJS (credentials never reach browser)
- **contact**: Browser/OS/platform detection sent with contact form
- **contact**: reCAPTCHA v3 invisible with server-side token verification
- **contact**: Math challenge (SVG-rendered), honeypot field, and time trap anti-spam
- **testimonials**: Added Zahi Bella (CEO Moon Holidays) and Lior R.
- **docs**: EmailJS email templates (notification + auto-reply)
- **env**: All sensitive config moved to environment variables
- **env**: DISABLE_RECAPTCHA toggle for development
- **env**: BIRTH_DATE for dynamic age calculation

### Changed
- **images**: Updated favtech images (git, kamatera, netlify, oracle, react-js, ssh, ubuntu)
- **contact**: Added server-side input length validation
- **deps**: Upgraded all packages to latest (Next.js 16, React 19, TypeScript 5.9, Tailwind 4, Heroicons v2, Headless UI v2, ESLint 10)
- **arch**: Migrated from Pages Router to App Router with proper server/client component split
- **styling**: Migrated from Tailwind 3 to Tailwind 4 (CSS-first config)
- **eslint**: Migrated from .eslintrc to flat config (eslint.config.mjs)
- **portfolio**: Updated with top GitHub projects sorted by stars
- **nav**: Rewrote section observer with scroll-based detection (fixes flickering)
- **responsive**: Fixed Hero, FavoriteTech, Portfolio, GithubStats, Testimonials, Contact for mobile
- **icons**: Consolidated from Font Awesome + Heroicons v1 to Heroicons v2 only
- **deps**: Replaced classnames with clsx, removed 15+ unused packages
- **deps**: Migrated reCAPTCHA v2 to v3 invisible
- **content**: Updated skills for 2026 (AI/LLMs, architecture, DevOps categories)
- **content**: Chronological career progression at Moon Holidays (Developer → Team Lead → Head of Development)
- **content**: Updated about section, location to Bangkok, dynamic age
- **content**: Resume reordered: Work → Education → Skills
- **license**: Added George Khananaev copyright
- **readme**: Complete rewrite with tech stack, setup, and credits

### Removed
- Unused testimonial photos (_hanan.webp, _marina.webp)
- github_actions.webp favtech image
- Pages Router (`src/pages/`)
- Font Awesome (5 packages)
- 7 unused icon components and files
- Hardcoded credentials from source code
- Tim Baker credit from UI (credited in README)
- react-google-recaptcha v2 package

### Fixed
- Navigation not highlighting correct section on click
- Hydration mismatch with Header dynamic import
- `outline-none` to `outline-hidden` for Tailwind 4 accessibility
- `RefObject<T | null>` for React 19 compatibility
- Error responses no longer leak internal service details

### Security
- Server-side reCAPTCHA v3 token verification via Google siteverify API
- Multi-layer anti-spam: reCAPTCHA v3 + math challenge + honeypot + time trap
- Sanitized error responses to prevent information leakage
