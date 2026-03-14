# Resume Website

Personal portfolio and resume website built by George Khananaev.

![Screenshot](https://github.com/georgekhananaev/resume-website/blob/main/screenshot.png?raw=true)

## Tech Stack

- **Next.js 16** (App Router, server & client components)
- **React 19**
- **TypeScript 5.9**
- **Tailwind CSS 4**
- **Headless UI 2** & **Heroicons 2**

## Features

- Server-side rendering with React Server Components
- Matrix rain background animation
- Auto-scrolling testimonials carousel
- Contact form with reCAPTCHA (server-side email via API route)
- Responsive mobile navigation
- SEO optimized with Next.js Metadata API
- Static site generation for fast loading

## Getting Started

### Prerequisites

- Node.js 20+
- npm

### Install & Run

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### Customize Content

All site content is in `src/data/data.tsx`. Update the values there and the site reflects changes on save. Images are in `src/images/`.

### Environment Variables

Copy `.env` and fill in your values:

| Variable | Description |
|----------|-------------|
| `EMAILJS_SERVICE_ID` | EmailJS service ID (server-side) |
| `EMAILJS_TEMPLATE_ID` | EmailJS template ID (server-side) |
| `EMAILJS_PUBLIC_KEY` | EmailJS public key (server-side) |
| `NEXT_PUBLIC_RECAPTCHA_SITE_KEY` | Google reCAPTCHA v2 site key |
| `NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION` | Google Search Console verification |
| `SITE_URL` | Site URL for sitemap generation |

### Build & Deploy

```bash
npm run build
npm start
```

## Credits

Initial design based on a template by [Tim Baker](https://github.com/tbakerx). Fully refactored, modernized, and maintained by [George Khananaev](https://github.com/georgekhananaev) — including migration to Next.js 16 App Router, React 19, Tailwind CSS 4, server components architecture, and all current functionality.

## License

MIT
