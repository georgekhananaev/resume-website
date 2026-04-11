# Resume Website

Personal portfolio and resume website built by George Khananaev.

![Screenshot](https://github.com/georgekhananaev/resume-website/blob/main/screenshot.png?raw=true)

## Tech Stack

- **Next.js 16** App Router with server and client components, Turbopack build
- **React 19** with modern patterns (no memo, no FC, no forwardRef)
- **TypeScript 5.9** with strict mode
- **Tailwind CSS 4** CSS-first configuration
- **MongoDB 7** for the portfolio blog, via the native `mongodb` driver (no ORM)
- **unified / remark / rehype** Markdown → HTML pipeline with `rehype-sanitize` and `rehype-prism-plus` syntax highlighting
- **Sharp** for build-time OG banner, icon, and favicon generation
- **jspdf** for on-demand `/api/resume` PDF generation
- **Headless UI 2** and **Heroicons 2**
- **ESLint 9** flat config (native `eslint-config-next`) with Prettier

## Features

- **MongoDB-backed portfolio blog** at `/portfolio` with per-post dynamic routes, per-post dynamic OG images, RSS feed, tag archives, and LLM-friendly `/llms.txt` — the whole catalog is seeded from `scripts/seed-posts.mjs`
- **Editorial dark redesign** across Hero, About, Resume, GithubStats, Services, FavoriteTech, Testimonials, and Footer — shared indigo palette, grid-mesh backdrops, and monospace category labels
- **Modern Header** with `usePathname` active-page state, GK avatar, pill-style indicators, and a mobile slide-in drawer
- **Dedicated `/contact` and `/work-with-me` pages** replacing the old single-page layout, with proper ContactPage / ProfessionalService JSON-LD
- **GitHub Stats Section** with live repo count, stars, followers, achievements, and top languages (fetched server-side, cached 1hr)
- **Dynamic PDF Resume** at `/api/resume` using jsPDF — includes the editorial grid mesh, reads content from the same `aboutData.description` as the home page
- **Health check endpoint** at `/api/health` — runs a real MongoDB ping + env var audit, returns public-safe JSON, HTTP 503 on degradation. The Footer shows a live green/red indicator next to the version badge
- **Contact Form** with reCAPTCHA v3 (score ≥ 0.5 + action match), server-side IP rate limiting, WhatsApp phone input with bundled country flag icons, EmailJS dispatch
- **Strict Content Security Policy** + all the modern security headers (HSTS, X-Frame-Options, X-Content-Type-Options, Referrer-Policy, Permissions-Policy)
- **SEO** via Next.js Metadata API, per-page JSON-LD (Person, WebSite, WebPage, Article, BreadcrumbList, ProfessionalService, ContactPage), sitemap, robots, OG + Twitter cards
- **ISR** (Incremental Static Regeneration) with 1-hour revalidation on blog pages and GitHub data

## Project Structure

```
src/
├── app/                    # Next.js App Router
│   ├── layout.tsx          # Root layout, metadata, icons
│   ├── page.tsx            # Home page with JSON-LD Person graph
│   ├── globals.css         # Tailwind + custom animations (@theme + @keyframes)
│   ├── contact/            # /contact page
│   ├── work-with-me/       # /work-with-me page
│   ├── portfolio/          # Portfolio list, [slug], tag/[tag], rss.xml, per-post OG image
│   ├── llms.txt/           # LLM-friendly catalog route
│   └── api/
│       ├── contact/        # Rate-limited contact form endpoint
│       ├── health/         # Health check endpoint (Mongo ping + env audit)
│       ├── posts/          # Internal-secret-gated post endpoint
│       └── resume/         # Dynamic PDF resume generator
├── components/
│   ├── Layout/             # PageHero, PageBreadcrumbs, Section
│   ├── Sections/           # Hero, About, Resume/, Footer, Header, etc.
│   ├── Portfolio/          # PostCard, PostRow, PostHeader, PostBody, etc.
│   ├── Icon/               # SVG icon components
│   └── HealthIndicator.tsx # Live /api/health status dot in Footer
├── data/
│   ├── data.tsx            # Site content (hero, about, experience, skills, etc.)
│   └── dataDef.ts          # TypeScript interfaces
├── lib/
│   ├── db.ts               # Cached MongoDB client
│   ├── posts.ts            # Post queries + ISR helpers
│   ├── markdown.ts         # unified/remark/rehype pipeline
│   ├── github-stars.ts     # Live star count fetcher
│   ├── breadcrumb.ts       # Schema.org BreadcrumbList helper
│   └── version.ts          # Compile-time APP_VERSION from package.json
├── types/                  # Shared TypeScript types (Post, etc.)
└── images/                 # Static assets and SVGs
```

## Getting Started

### Prerequisites

- Node.js 20+
- npm
- A free **[MongoDB Atlas](https://www.mongodb.com/)** account (M0 tier — 500 MB, no credit card, plenty for this site)

### 1. MongoDB Atlas setup

The portfolio blog, sitemap, RSS feed, and `/llms.txt` all read from a MongoDB collection. Without a database the site won't boot — `src/lib/db.ts` throws if `MONGODB_URI` isn't set.

1. Sign up at **https://www.mongodb.com/** and create a new project
2. Deploy a free-tier **M0 cluster** (500 MB storage, no cost, no card required)
3. Under *Database Access*, create a user with read/write permission on the cluster
4. Under *Network Access*, whitelist your IP — or `0.0.0.0/0` if you're deploying to Netlify / Vercel and can't pin a single egress IP
5. Click *Connect* → *Drivers* → copy the **SRV connection string** (looks like `mongodb+srv://<user>:<password>@cluster.mongodb.net/...`)
6. Paste it into your `.env` as `MONGODB_URI`, replacing `<user>` and `<password>` with your real credentials
7. Set `MONGODB_DB` to whatever name you want for the database (e.g. `your_name_portfolio`) — the driver creates it on first write

### 2. Clone and install

```bash
# Clone the repository
git clone https://github.com/georgekhananaev/resume-website.git
cd resume-website

# Copy environment variables and fill them in
cp .env.example .env
$EDITOR .env

# Install dependencies
npm install
```

### 3. Seed the portfolio blog

Run the seed script once to populate MongoDB with the starter portfolio posts. Re-run any time you edit `scripts/seed-posts.mjs` — the script is idempotent (upserts by slug):

```bash
node --env-file=.env scripts/seed-posts.mjs
```

### 4. Start the dev server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). Visit [http://localhost:3000/api/health](http://localhost:3000/api/health) to verify MongoDB is reachable — you should see `{"status":"ok",...}`.

### Environment Variables

Copy `.env.example` to `.env` and fill in your values:

| Variable | Server/Client | Description |
| --- | --- | --- |
| `MONGODB_URI` | Server | MongoDB Atlas SRV connection string — [free M0 tier](https://www.mongodb.com/) gives 500 MB, no credit card needed |
| `MONGODB_DB` | Server | Database name (e.g. `your_name_portfolio`). Falls back to `george_khananaev_portfolio` if unset |
| `EMAILJS_SERVICE_ID` | Server | EmailJS service ID |
| `EMAILJS_TEMPLATE_ID` | Server | EmailJS template ID |
| `EMAILJS_PUBLIC_KEY` | Server | EmailJS public key |
| `EMAILJS_PRIVATE_KEY` | Server | EmailJS private/access key |
| `EMAILJS_TO_EMAIL` | Server | Recipient email for contact form |
| `NEXT_PUBLIC_RECAPTCHA_SITE_KEY` | Client | Google reCAPTCHA v3 site key |
| `RECAPTCHA_SECRET_KEY` | Server | Google reCAPTCHA v3 secret key |
| `NEXT_PUBLIC_DISABLE_RECAPTCHA` | Client | Set `true` to disable reCAPTCHA in dev (ignored in production) |
| `NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION` | Client | Google Search Console verification |
| `GITHUB_USERNAME` | Server | GitHub username for stats section |
| `GITHUB_PRIVATE_REPOS` | Server | Number of private repos (added to public count) |
| `GITHUB_TOKEN` | Server | GitHub fine-grained token (for rate limits) |
| `BIRTH_DATE` | Server | Birth date for dynamic age calculation (YYYY-MM-DD) |
| `SITE_URL` | Build | Canonical site URL used in sitemap, OG tags, and JSON-LD |

### Customize Content

All site content lives in `src/data/data.tsx`. Update text, images, links, and the site reflects changes on save. Portfolio SVG illustrations are in `src/images/portfolio/`. Blog posts live in MongoDB — edit and re-run `scripts/seed-posts.mjs` to update them.

### Brand assets

OG banner, PWA icons, apple-touch-icon, and the `GK` favicon are all regenerated from a single source photo via:

```bash
node scripts/generate-images.mjs
```

The script reads `public/george_khananaev_ws.png` and writes `public/og-image.png`, `icon-512.png`, `icon-192.png`, `apple-touch-icon.png`, and `favicon.ico`. Brand colors are constants at the top of the script — edit and re-run to rebrand.

### Build and Deploy

```bash
npm run build
npm start
```

### Available Scripts

| Script | Description |
| --- | --- |
| `npm run dev` | Start dev server with Turbopack |
| `npm run build` | Production build |
| `npm start` | Start production server |
| `npm run lint` | Run ESLint (flat config, native `eslint-config-next`) |
| `npm run typecheck` | Run `tsc --noEmit` for type-only check |
| `npm run clean` | Remove `.next` build cache |

## Email Templates

Custom EmailJS email templates are in `docs/`:

- `docs/emailjs-template.html` — notification sent to you when someone submits the contact form
- `docs/emailjs-auto-reply-template.html` — auto-reply confirmation sent to the sender

Copy the HTML into your EmailJS template editor. Templates use `{{from_name}}`, `{{from_email}}`, `{{from_phone}}`, `{{message}}`, `{{title}}`, and device info variables.

## Changelog

See [CHANGELOG.md](CHANGELOG.md) for a detailed list of changes.

## Credits

Initial design based on a template by [Tim Baker](https://github.com/tbakerx). Fully refactored, modernized, and maintained by [George Khananaev](https://github.com/georgekhananaev) — including migration to Next.js 16 App Router, React 19, Tailwind CSS 4, server components architecture, and all current functionality.

## License

MIT — see [LICENSE](LICENSE) for details.

[![Netlify Status](https://api.netlify.com/api/v1/badges/4e6cdcf5-06db-4e22-9739-cefd33f748b5/deploy-status)](https://app.netlify.com/sites/georgekhananaev/deploys)
