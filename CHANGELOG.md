# Changelog

Format: [Keep a Changelog](https://keepachangelog.com/), [SemVer](https://semver.org/)

## [Unreleased]

### Added

### Changed

### Fixed

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
