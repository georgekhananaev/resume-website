# Resume Website

Personal portfolio and resume website built by George Khananaev.

![Screenshot](https://github.com/georgekhananaev/resume-website/blob/main/screenshot.png?raw=true)

## Tech Stack

- **Next.js 16** App Router with server and client components
- **React 19** with modern patterns (no memo, no FC, no forwardRef)
- **TypeScript 5.9** with strict mode
- **Tailwind CSS 4** CSS-first configuration
- **Headless UI 2** and **Heroicons 2**
- **ESLint 10** flat config with Prettier

## Features

- **Server Components** for About, Resume, Skills, FavoriteTech, Contact, Footer
- **Client Components** for Header, Hero, Portfolio, Testimonials, ContactForm
- **GitHub Stats Section** with repo count, stars, followers, achievements, and top languages (fetched server-side, cached 1hr)
- **Animated Portfolio Cards** with particle canvas backgrounds
- **Matrix Rain** background animation on hero section
- **Contact Form** with reCAPTCHA, WhatsApp phone input with country code, server-side EmailJS via API route
- **Auto-scrolling Testimonials** carousel with parallax background
- **Responsive Design** across all breakpoints
- **SEO** via Next.js Metadata API, sitemap generation, Open Graph
- **ISR** (Incremental Static Regeneration) for GitHub data

## Project Structure

```
src/
├── app/                    # Next.js App Router
│   ├── layout.tsx          # Root layout, metadata
│   ├── page.tsx            # Home page (server component)
│   ├── globals.css         # Tailwind + custom styles
│   └── api/contact/        # Contact form API route
├── components/
│   ├── Sections/           # Page sections (server + client)
│   ├── Icon/               # SVG icon components
│   ├── CardBackground.tsx  # Animated particle canvas
│   ├── MatrixBackground.tsx # Matrix rain effect
│   └── TextAnimation.tsx   # Typing animation
├── data/
│   ├── data.tsx            # All site content
│   └── dataDef.ts          # TypeScript interfaces
├── hooks/                  # Custom React hooks
├── images/                 # Static assets and SVGs
└── config.ts               # Browser detection utilities
```

## Getting Started

### Prerequisites

- Node.js 20+
- npm

### Setup

```bash
# Clone the repository
git clone https://github.com/georgekhananaev/resume-website.git
cd resume-website

# Copy environment variables
cp .env.example .env

# Install dependencies
npm install

# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### Environment Variables

Copy `.env.example` to `.env` and fill in your values:

| Variable | Server/Client | Description |
|----------|--------------|-------------|
| `EMAILJS_SERVICE_ID` | Server | EmailJS service ID |
| `EMAILJS_TEMPLATE_ID` | Server | EmailJS template ID |
| `EMAILJS_PUBLIC_KEY` | Server | EmailJS public key |
| `EMAILJS_PRIVATE_KEY` | Server | EmailJS private/access key |
| `EMAILJS_TO_EMAIL` | Server | Recipient email for contact form |
| `NEXT_PUBLIC_RECAPTCHA_SITE_KEY` | Client | Google reCAPTCHA v2 site key |
| `NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION` | Client | Google Search Console verification |
| `GITHUB_USERNAME` | Server | GitHub username for stats section |
| `GITHUB_PRIVATE_REPOS` | Server | Number of private repos (added to public count) |
| `GITHUB_TOKEN` | Server | GitHub fine-grained token (for rate limits) |
| `SITE_URL` | Build | Site URL for sitemap generation |

### Customize Content

All site content lives in `src/data/data.tsx`. Update text, images, links, and the site reflects changes on save. Portfolio SVG illustrations are in `src/images/portfolio/`.

### Build and Deploy

```bash
npm run build
npm start
```

### Available Scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Start dev server with Turbopack |
| `npm run build` | Production build |
| `npm start` | Start production server |
| `npm run lint` | Run ESLint |
| `npm run clean` | Remove `.next` build cache |
| `npm run sitemap` | Generate sitemap |

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
