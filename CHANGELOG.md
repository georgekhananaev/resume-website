# Changelog

Format: [Keep a Changelog](https://keepachangelog.com/), [SemVer](https://semver.org/)

## [Unreleased]

### Added
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
