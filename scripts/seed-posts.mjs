#!/usr/bin/env node
/**
 * Seed script for the portfolio posts collection.
 *
 * Run:
 *   node --env-file=.env scripts/seed-posts.mjs
 *
 * What it does:
 *   1. Connects to MongoDB using MONGODB_URI.
 *   2. Ensures indexes on slug (unique), status+publishedAt, tags, featured, updatedAt.
 *   3. Upserts 8 seed post documents based on existing portfolioItems.
 *   4. Prints a summary.
 *
 * Safe to re-run. Uses $set on upsert so re-running won't duplicate.
 */

import {MongoClient} from 'mongodb';
import {readdirSync, copyFileSync, mkdirSync, existsSync} from 'node:fs';
import {resolve, dirname, join} from 'node:path';
import {fileURLToPath} from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const projectRoot = resolve(__dirname, '..');

const MONGODB_URI = process.env.MONGODB_URI;
const MONGODB_DB = process.env.MONGODB_DB || 'george_khananaev_portfolio';
const POSTS_COLLECTION = 'posts';

if (!MONGODB_URI) {
    console.error('✗ MONGODB_URI is not set. Run with: node --env-file=.env scripts/seed-posts.mjs');
    process.exit(1);
}

// ---------------------------------------------------------------------------
// Step 1: copy portfolio SVGs into public/portfolio/ so they can be served
// as public URLs (thumbnails in MongoDB docs).
// ---------------------------------------------------------------------------

function copyPortfolioImages() {
    const sourceDir = join(projectRoot, 'src/images/portfolio');
    const targetDir = join(projectRoot, 'public/portfolio');

    if (!existsSync(targetDir)) {
        mkdirSync(targetDir, {recursive: true});
    }

    const files = readdirSync(sourceDir).filter(f => f.endsWith('.svg'));
    let copied = 0;
    for (const file of files) {
        copyFileSync(join(sourceDir, file), join(targetDir, file));
        copied++;
    }
    return copied;
}

// ---------------------------------------------------------------------------
// Step 2: seed post definitions. 8 case-study stubs from existing portfolio.
// Content length kept modest (300-500 words) — these are seed posts meant
// to prove the pipeline, not the final long-form case studies George will
// write later.
// ---------------------------------------------------------------------------

const AUTHOR = {
    name: 'George Khananaev',
    url: 'https://george.khananaev.com',
    avatar: '/webp/george_khananaev_ws.webp',
};

const GITHUB_TOKEN = process.env.GITHUB_TOKEN;

/**
 * Fetch the repo's created_at date from GitHub. This is the authoritative
 * "when was this project first published" timestamp. Both publishedAt and
 * updatedAt are set to this value so the post doesn't claim to have been
 * updated after its creation.
 *
 * Returns null on any failure so the caller can fall back to a default date.
 */
async function fetchGithubCreatedAt(githubUrl) {
    if (!githubUrl) return null;
    const match = githubUrl.match(/github\.com\/([^/]+)\/([^/?#]+)/);
    if (!match) return null;
    const [, owner, repoRaw] = match;
    const repo = repoRaw.replace(/\.git$/, '');

    const headers = GITHUB_TOKEN
        ? {Authorization: `Bearer ${GITHUB_TOKEN}`, Accept: 'application/vnd.github.v3+json'}
        : {Accept: 'application/vnd.github.v3+json'};

    try {
        const res = await fetch(`https://api.github.com/repos/${owner}/${repo}`, {headers});
        if (!res.ok) return null;
        const data = await res.json();
        if (!data.created_at) return null;
        return new Date(data.created_at);
    } catch (err) {
        console.warn(`  ⚠ Could not fetch created_at for ${githubUrl}: ${err.message}`);
        return null;
    }
}

const now = new Date();

function daysAgo(n) {
    const d = new Date(now);
    d.setDate(d.getDate() - n);
    return d;
}

const seedPosts = [
    {
        slug: 'google-reviews-scraper-pro',
        title: 'Building Google Reviews Scraper Pro',
        subtitle: 'A resilient Python web scraper for multi-language Google Maps reviews',
        excerpt:
            'A production-grade Google Maps review scraper that extracts multi-language reviews with images, writes to MongoDB, and handles detection countermeasures. Incremental scraping, image downloading, and URL replacement built for scale.',
        content: `## Overview

Google Reviews Scraper Pro is a Python tool that extracts reviews from Google Maps listings, handles multiple languages, downloads review images, and stores the results in MongoDB. It was built to solve a real operational problem: manually collecting reviews for thousands of listings is not just slow, it is error-prone and impossible to scale.

## The problem it solves

Review data is locked behind a JavaScript-heavy interface that actively resists scraping. Off-the-shelf tools break within weeks because Google rotates DOM selectors, throttles requests, and serves different markup to different user agents. This project takes the long view: it assumes the DOM will change and designs around that assumption.

## Key features

- **Multi-language extraction**. Reviews are captured regardless of their original language, with metadata preserved for later translation or classification.
- **Incremental scraping**. On subsequent runs it picks up where it left off, only fetching new reviews. This makes daily cron runs cheap.
- **Image downloading**. Reviews with photos get their images pulled into storage, with URLs rewritten to point at the local copies.
- **MongoDB integration**. Built-in persistence means no CSV juggling. Queries are fast and the schema supports filtering by rating, language, date, and author.
- **Detection resilience**. Rate limiting, user-agent rotation, and request shaping keep the scraper under the radar.

## Tech stack

Python, Playwright for headless browsing, BeautifulSoup for parsing, MongoDB for storage, and Pillow for image processing. Dockerized so it runs anywhere with one command.

## What I would do differently

If I were rebuilding this today, I'd move the image pipeline to a proper object store (Cloudflare R2 or S3) instead of local filesystem, and I'd split the scraping logic from the persistence layer so each can be tested independently. The current version couples them tightly, which makes unit tests awkward.

## Takeaway

Scraping at scale is less about clever selectors and more about resilience. Every decision — rate limits, retries, checkpointing, logging — matters more than the HTML parsing itself. Build assuming things will break, and they break less.`,
        tags: ['python', 'web-scraping', 'mongodb', 'automation', 'playwright'],
        category: 'Case Study',
        thumbnailFile: 'google-reviews-scraper-pro.svg',
        githubUrl: 'https://github.com/georgekhananaev/google-reviews-scraper-pro',
        featured: true,
        daysAgo: 30,
        metaTitle: 'Google Reviews Scraper Pro — Python + MongoDB review extraction',
        metaDescription:
            'Open-source Python scraper that extracts multi-language Google Maps reviews with images, writes to MongoDB, handles anti-detection, and supports incremental re-runs. 170+ stars on GitHub.',
        seoKeywords: ['google reviews scraper', 'web scraping', 'python playwright', 'mongodb', 'google maps reviews', 'review extraction', 'data pipelines', 'anti-detection', 'open source'],
        about: ['Python', 'Playwright', 'MongoDB', 'Web scraping', 'Google Maps'],
        mentions: ['Docker', 'Pillow', 'BeautifulSoup'],
    },
    {
        slug: 'excel-ai-assistant',
        title: 'Excel AI Assistant: AI transforms for spreadsheets',
        subtitle: 'A Python desktop app that adds LLM-powered transformations to Excel and CSV files',
        excerpt:
            'A Python desktop application that enhances Excel and CSV files using AI transformations. Features dual AI backends (OpenAI API and local Ollama), customizable prompt templates, batch processing, and a workflow built for analysts who want AI without leaving their spreadsheet.',
        content: `## Overview

Excel AI Assistant is a desktop application that brings large language models into the spreadsheet workflow. Point it at an Excel or CSV file, pick a column, write a prompt template, and let the model process every row. The results are written back to a new column without touching the original.

## Why I built it

Analysts I worked with had a recurring problem. They had thousands of rows of messy text — customer feedback, product descriptions, addresses, translated content — and they needed to clean, classify, summarize, or translate it. The existing options were all bad: copy-paste into ChatGPT one row at a time, write a one-off Python script, or pay for a SaaS that charged per row and refused to run locally.

## Key features

- **Dual AI backends**. OpenAI API for maximum quality, or local Ollama for privacy-sensitive data that must not leave the machine. Switching between them is one click.
- **Prompt templates**. Reusable prompts with placeholder variables. Save a template once, reuse it across files.
- **Batch processing**. Rows processed in parallel with configurable concurrency. Progress bar with live ETA.
- **Safe by default**. Never overwrites the source file. Writes to a new column or a new file. Previews before committing.
- **Format aware**. Handles Excel sheets, CSVs, and TSVs. Preserves formatting, formulas, and cell types where possible.

## Tech stack

Python, PyQt6 for the desktop UI, openpyxl and pandas for spreadsheet handling, OpenAI SDK and Ollama HTTP client for the AI backends, and a custom prompt template engine built on Jinja2.

## The interesting engineering problem

Rate limiting. OpenAI has per-minute token limits, Ollama has per-model memory limits, and a batch of 10,000 rows needs to respect both without stalling. The solution was a token-bucket rate limiter that adapts per backend, with automatic backoff on 429s and a queue that survives app restarts so a crashed run can resume.

## Takeaway

LLMs are cheap to call and expensive to orchestrate. The real work in a tool like this is not the AI prompt, it is the plumbing around it: rate limits, retries, error recovery, preview-before-commit, and a UI that makes a non-developer feel safe.`,
        tags: ['python', 'ai', 'llm', 'openai', 'ollama', 'desktop'],
        category: 'Case Study',
        thumbnailFile: 'excel-ai-assistant.svg',
        githubUrl: 'https://github.com/georgekhananaev/excel-ai-assistant',
        featured: true,
        daysAgo: 45,
        metaTitle: 'Excel AI Assistant — Python desktop app for AI-powered spreadsheets',
        metaDescription:
            'Python desktop application with PyQt6 that adds OpenAI and self-hosted Ollama AI transformations to Excel and CSV files. Batch processing, dual backends, prompt templates, and rate-limit aware.',
        seoKeywords: ['excel ai assistant', 'openai excel', 'ollama desktop', 'python pyqt6', 'spreadsheet automation', 'llm batch processing', 'csv transformation', 'prompt templates'],
        about: ['Python', 'PyQt6', 'OpenAI', 'Ollama', 'Desktop applications', 'Large language models'],
        mentions: ['pandas', 'openpyxl', 'Jinja2', 'Rate limiting'],
    },
    {
        slug: 'pynextstack',
        title: 'PyNextStack: a full-stack user management starter',
        subtitle: 'FastAPI backend, Next.js frontend, auth and profiles out of the box',
        excerpt:
            'A full-stack user management system with a Next.js frontend and FastAPI backend. Registration, authentication, profile management, and a Material-UI interface. Production-ready defaults so you can focus on your actual product instead of rebuilding the login form.',
        content: `## Overview

PyNextStack is a starter kit for full-stack applications that need user accounts. It pairs a FastAPI backend with a Next.js frontend, handles registration, authentication, password reset, profile management, and email verification out of the box. The goal is to get to your first real feature on day one.

## The problem it solves

Every new product I start spends the first week rebuilding the same user-management layer. Registration, login, session, password reset, email verification, profile pages, admin. It is all commodity work, none of it is product-differentiating, and most of it has subtle security pitfalls. PyNextStack captures the pieces I'd write anyway so I can skip straight to the part that actually matters.

## What is included

- **FastAPI backend** with JWT auth, password hashing (bcrypt), email verification, and password reset flows
- **Next.js frontend** with typed API client, protected routes, and Material-UI components
- **Database layer** abstracted so you can swap PostgreSQL, MySQL, or MongoDB
- **Email layer** pluggable for SendGrid, AWS SES, SMTP, or local testing
- **Admin area** with user list, role management, and audit log
- **Docker Compose** for local development with hot reload on both ends

## Design choices worth highlighting

The frontend and backend communicate through a typed API client generated from the FastAPI OpenAPI schema. That means when you change a backend endpoint, the TypeScript types update automatically and the frontend breaks with a compiler error. No runtime drift between the two.

Auth uses short-lived access tokens (15 minutes) paired with long-lived refresh tokens (7 days, httpOnly cookie). The access token lives in memory, the refresh token is invisible to JavaScript. This is the sweet spot between developer ergonomics and security.

## Tech stack

Python, FastAPI, Pydantic, SQLAlchemy or Motor (depending on DB), Next.js App Router, React, TypeScript, Material-UI, Docker, and GitHub Actions for CI.

## Takeaway

Starter kits earn their keep when they embody opinions. PyNextStack is opinionated on purpose: short-lived JWTs, refresh tokens in httpOnly cookies, typed API client, Material-UI as the component library. If your product has different needs, fork it. If it doesn't, use it and ship.`,
        tags: ['fastapi', 'nextjs', 'python', 'typescript', 'authentication', 'full-stack'],
        category: 'Case Study',
        thumbnailFile: 'pynextstack.svg',
        githubUrl: 'https://github.com/georgekhananaev/PyNextStack',
        featured: true,
        daysAgo: 60,
        metaTitle: 'PyNextStack — Full-stack FastAPI + Next.js user management starter',
        metaDescription:
            'Open-source starter kit with FastAPI backend, Next.js frontend, JWT auth with refresh tokens, Material-UI, email verification, admin area, and typed API client. Ship your product, not the login form.',
        seoKeywords: ['pynextstack', 'fastapi starter', 'nextjs boilerplate', 'user management system', 'jwt authentication', 'refresh tokens', 'material-ui', 'typed api client', 'full-stack template'],
        about: ['FastAPI', 'Next.js', 'TypeScript', 'Authentication', 'Starter kits'],
        mentions: ['JWT', 'Material-UI', 'Docker Compose', 'Refresh tokens', 'Email verification'],
    },
    {
        slug: 'py-image-compressor',
        title: 'py-image-compressor: batch image compression in Python',
        subtitle: 'A lightweight CLI for compressing, converting, and resizing images in bulk',
        excerpt:
            'A small Python utility for compressing, converting, and resizing hundreds of images at once. Supports modern formats like WebP, handles recursive directory scans, and preserves structure so you can run it on a whole asset folder safely.',
        content: `## Overview

py-image-compressor is a small CLI that takes a directory of images and outputs an optimized version of every file. It handles JPEG, PNG, and WebP, resizes to a target max dimension, and writes results to a parallel output directory so the originals are never touched.

## Why I built it

My personal and client projects all have the same bottleneck before launch: image optimization. You have a folder of 300 raw screenshots, logos, and hero images, and you need them all resized and recompressed without losing quality. The existing options were either heavy desktop apps or one-off scripts that I rewrote every time. This tool replaced the rewriting.

## What it does

- **Recursive directory scan** with glob-style filters
- **Format conversion** to WebP or JPEG with tunable quality
- **Resizing** to a target max dimension, preserving aspect ratio
- **Structure preservation** so output mirrors input
- **Progress reporting** so you know the long jobs are actually progressing
- **Dry run mode** for previewing what would change without writing files

## Tech stack

Python, Pillow for image manipulation, Click for the CLI interface, and concurrent.futures for parallel processing across CPU cores.

## The interesting bit

Pillow is fast enough per-image, but the real wins come from parallelism. A 4-core machine processing 300 images sequentially takes ~3 minutes; the same machine with a thread pool processes them in ~45 seconds. The caveat is that Python's GIL makes CPU-bound threads ineffective — you need process pools, not thread pools, for real speedup on image work.

## Takeaway

Small tools earn their keep by removing small repeated friction. This one is maybe 200 lines of Python, but it has saved me hours cumulatively. Build the tool; the investment pays back faster than you expect.`,
        tags: ['python', 'cli', 'images', 'webp', 'automation'],
        category: 'Case Study',
        thumbnailFile: 'py-image-compressor.svg',
        githubUrl: 'https://github.com/georgekhananaev/py-image-compressor',
        featured: false,
        daysAgo: 75,
        metaTitle: 'py-image-compressor — Batch image optimization CLI in Python',
        metaDescription:
            'Lightweight Python CLI for compressing, converting, and resizing images in bulk. WebP, JPEG, PNG, parallel processing with process pools, dry-run mode, and directory-structure preservation.',
        seoKeywords: ['python image compressor', 'batch webp conversion', 'image optimization cli', 'pillow', 'python click', 'concurrent futures', 'process pool', 'image resize'],
        about: ['Python', 'Pillow', 'CLI tools', 'Image processing', 'WebP'],
        mentions: ['Click', 'concurrent.futures', 'WebP conversion'],
    },
    {
        slug: 'spark-clean',
        title: 'Spark Clean: a macOS storage cleaner for developers',
        subtitle: 'Free, open source, and built for developer workflows',
        excerpt:
            'A free, open-source macOS storage and cache cleaner built specifically for developers. Scans Docker images, Xcode derived data, Node.js node_modules, Ollama models, JetBrains caches, Homebrew cellar, and more. Shows you exactly what it wants to delete before it deletes anything.',
        content: `## Overview

Spark Clean is a native macOS application that scans your disk for developer-specific bloat and offers to reclaim it. Unlike generic cleaners that treat all files the same, Spark Clean understands what a Docker image is, what \`node_modules\` means, why Xcode's DerivedData exists, and when it is safe to delete.

## Why I built it

My laptop was always full. Running \`du -sh *\` told me where the space went, but deleting Docker images, Node modules, and Xcode caches by hand was tedious and error-prone. Paid cleaners either ignored developer-specific directories or deleted things I wanted to keep. Nothing fit, so I built the thing I wished existed.

## What it scans

- **Docker** images, volumes, build cache, and unused networks
- **Xcode** derived data, archives, simulator caches
- **Node.js** node_modules directories (with optional age threshold)
- **JetBrains** IDE caches for IntelliJ, WebStorm, PyCharm, Rider, GoLand, RubyMine
- **Homebrew** unused cellar entries and downloaded tarballs
- **Ollama** models that have not been used in a configurable window
- **System caches** in \`~/Library/Caches\`

## Design choices

Two principles drove the design. First: **never delete without explicit confirmation**. Every item is shown with its size and last-used date before anything is removed. Second: **categorize, don't rank**. Users want to decide per-category ("yes to Docker, no to Xcode") rather than scroll through a flat list of 400 files.

## Tech stack

Swift, SwiftUI, and shell commands under the hood for the actual disk operations. The UI is fully reactive: scans happen in the background, results stream in, and you can start deleting before the scan finishes.

## Takeaway

Developer tools are a tight niche, but the audience is loyal. If you build something that solves a problem developers have every week, they remember it and they tell their colleagues. Spark Clean took a weekend to build and it is the tool I open on every new machine.`,
        tags: ['swift', 'macos', 'devtools', 'open-source'],
        category: 'Case Study',
        thumbnailFile: 'spark-clean.svg',
        githubUrl: 'https://github.com/georgekhananaev/spark-clean',
        featured: false,
        daysAgo: 90,
        metaTitle: 'Spark Clean — macOS storage cleaner built for developers',
        metaDescription:
            'Free, open-source Swift/SwiftUI app that scans Docker images, Xcode derived data, node_modules, JetBrains caches, Homebrew cellar, and Ollama models. Never deletes without explicit confirmation.',
        seoKeywords: ['spark clean', 'macos cleaner', 'swift swiftui', 'docker cleanup', 'xcode derived data', 'node_modules cleanup', 'homebrew cleanup', 'jetbrains cache', 'ollama models'],
        about: ['Swift', 'SwiftUI', 'macOS', 'Developer tools'],
        mentions: ['Docker', 'Xcode', 'Node.js', 'Homebrew', 'JetBrains', 'Ollama'],
    },
    {
        slug: 'fastapi-docshield',
        title: 'FastAPI DocShield: protect your API docs with one line',
        subtitle: 'HTTP Basic Auth on the OpenAPI docs endpoints for FastAPI',
        excerpt:
            'A tiny FastAPI extension that adds HTTP Basic Authentication to the Swagger UI, ReDoc, and OpenAPI JSON endpoints. Drop it in, set a username and password, and your API docs are no longer public. Useful when you want docs in production but not publicly indexable.',
        content: `## Overview

FastAPI DocShield is a small library that locks down the auto-generated documentation endpoints on a FastAPI application. By default FastAPI exposes \`/docs\`, \`/redoc\`, and \`/openapi.json\` without authentication, which is fine in development but often unwanted in production. DocShield adds HTTP Basic Auth to those routes with a single import.

## Why this exists

Most FastAPI apps in production want to keep the interactive docs around for internal teams but do not want every GoogleBot in the world crawling them. The obvious solutions are either to disable the docs in production (annoying when you need them) or to write a middleware manually (easy to get wrong). DocShield captures the right approach in a reusable package.

## How it works

\`\`\`python
from fastapi import FastAPI
from fastapi_docshield import DocShield

app = FastAPI()
DocShield(app, username="admin", password="secret")
\`\`\`

Behind the scenes it wraps the three doc endpoints with a dependency that checks the \`Authorization\` header for Basic credentials. If they match, the request proceeds. If they don't, a \`WWW-Authenticate\` header is returned so the browser prompts for credentials.

## Security notes

Basic Auth is fine for this use case — you are protecting documentation, not user data. If the docs themselves contain sensitive information (internal endpoints, undocumented features), consider combining DocShield with a VPN or an IP allowlist so a credential leak cannot single-handedly expose the API surface.

Always use HTTPS in production. Basic Auth sends credentials in base64 encoding, which is trivially decoded if intercepted.

## Tech stack

Pure FastAPI. No external dependencies beyond the framework itself.

## Takeaway

Small libraries that do one thing well earn adoption. DocShield is ~50 lines of code and has saved me from writing the same middleware in three different projects.`,
        tags: ['fastapi', 'python', 'security', 'authentication'],
        category: 'Open Source',
        thumbnailFile: 'fastapi-docshield.svg',
        githubUrl: 'https://github.com/georgekhananaev/fastapi-docshield',
        featured: false,
        daysAgo: 100,
        metaTitle: 'FastAPI DocShield — HTTP Basic Auth for API docs endpoints',
        metaDescription:
            'Tiny FastAPI extension that adds HTTP Basic Authentication to Swagger UI, ReDoc, and OpenAPI JSON endpoints. One import, one function call, and your docs are no longer public.',
        seoKeywords: ['fastapi docshield', 'fastapi security', 'http basic auth', 'swagger ui protection', 'openapi auth', 'python api security', 'redoc protection'],
        about: ['FastAPI', 'Python', 'API security', 'HTTP Basic Auth'],
        mentions: ['Swagger UI', 'ReDoc', 'OpenAPI'],
    },
    {
        slug: 'claude-skills-vault',
        title: 'Claude Skills Vault: production workflows for Claude Code',
        subtitle: 'Curated skills that automate senior full-stack workflows',
        excerpt:
            'A curated collection of high-impact skills for Claude Code designed to supercharge senior full-stack workflows. Automates architectural reviews, TDD cycles, commit discipline, and PR management so you spend more time on the interesting problems and less on the repeatable ones.',
        content: `## Overview

Claude Skills Vault is a collection of production-ready skills for Claude Code, Anthropic's agentic coding tool. Each skill captures a workflow I run often enough that it needs to be automated: architecture reviews, TDD loops, commit discipline, PR preparation, dependency audits, and more.

## Why this matters

Claude Code gets more useful the more opinionated you make it. Out of the box it is a general-purpose assistant, but with well-written skills it becomes a specialist that understands your standards and enforces them automatically. The vault is my attempt to bottle the habits of a senior engineer into repeatable, distributable units.

## What is in the vault

- **Architecture review**. Analyzes a diff or a new file against common anti-patterns and flags concerns before code review.
- **TDD loop**. Writes the failing test first, then iterates implementation until it passes, then refactors.
- **Commit discipline**. Enforces commit message conventions, catches \`console.log\` leftovers, ensures no WIP code reaches main.
- **PR preparation**. Generates a clean PR description with context, test plan, and reviewer guidance.
- **Dependency audit**. Flags outdated, deprecated, or vulnerable dependencies.
- **Security check**. Catches common security foot-guns (SQL injection vectors, unsanitized HTML, secrets in code).

## Design principles

Every skill in the vault follows three rules:

1. **Deterministic where possible**. If a check can be a grep or a regex, it is. The LLM is only invoked for judgment calls that require understanding context.
2. **Fast to fail**. Short feedback loops. A 5-second check run on every save beats a 5-minute check that runs once.
3. **Composable**. Skills are single-purpose so they can be chained or mixed with project-specific workflows.

## Takeaway

The future of coding tools is less about generation and more about discipline. Claude Skills Vault is a bet on the latter: the winning AI workflow is one that makes you a more disciplined engineer, not a faster one.`,
        tags: ['ai', 'claude', 'developer-tools', 'workflow'],
        category: 'Open Source',
        thumbnailFile: 'claude-skills-vault.svg',
        githubUrl: 'https://github.com/georgekhananaev/claude-skills-vault',
        featured: false,
        daysAgo: 20,
        metaTitle: 'Claude Skills Vault — Production workflows for Claude Code',
        metaDescription:
            'A curated collection of high-impact Claude Code skills for senior full-stack workflows. Automates architectural reviews, TDD cycles, commit discipline, and PR management. Open source.',
        seoKeywords: ['claude skills vault', 'claude code skills', 'anthropic claude', 'ai developer tools', 'automated code review', 'tdd automation', 'senior developer workflow', 'prompt engineering'],
        about: ['Claude', 'Anthropic', 'AI workflows', 'Developer automation'],
        mentions: ['Claude Code', 'TDD', 'Code review', 'Pull requests'],
    },
    {
        slug: 'darktheme-auth-fastapi-server',
        title: 'Dark Theme Auth FastAPI Server',
        subtitle: 'A FastAPI template with auth-protected endpoints, Redis, logging, and a custom dark-themed docs UI',
        excerpt:
            'A versatile FastAPI server template with authentication-protected endpoints, Redis caching, structured logging, and a custom dark theme for the API documentation. A solid foundation for production APIs that want opinions baked in from day one.',
        content: `## Overview

Dark Theme Auth FastAPI Server is a starter template for production FastAPI applications. It bundles authentication, Redis caching, structured logging, and a custom dark-themed Swagger UI into a single repo you can clone, rename, and start building on top of.

## What it gives you

- **JWT authentication** with login, token refresh, and role-based access control
- **Redis integration** for caching, rate limiting, and session storage
- **Structured logging** with request IDs, response times, and trace correlation
- **Dark-themed docs** — the Swagger UI is rebranded with a custom CSS that is easier on the eyes during long debugging sessions
- **Health check and metrics endpoints** ready for Kubernetes liveness/readiness probes
- **Docker Compose** for local development
- **Pytest setup** with fixtures for auth and DB isolation

## Design choices

The template is opinionated on purpose. JWT uses RS256 asymmetric signing so the signing key never leaves the auth service. Redis is mandatory — not optional — because production apps that "maybe need caching later" always end up bolting it on in a rush. Logging is structured JSON because grep on structured logs is a thousand times more productive than grep on free text.

## Tech stack

Python 3.11+, FastAPI, Pydantic v2, Redis, Docker, pytest, and Uvicorn with workers for production. Also ships with a GitHub Actions workflow for CI (test + lint + type-check).

## When to use this

Reach for this template when starting a new API service that needs to be production-ready quickly. It is not a framework and not a library — it is a shape you fill in. Fork it, delete the example routes, add your own, and ship.

## Takeaway

A good template saves a day on every new project. This one captures the decisions I would otherwise make from scratch each time, so I can focus on the part that is actually novel.`,
        tags: ['fastapi', 'python', 'redis', 'authentication', 'template'],
        category: 'Open Source',
        thumbnailFile: 'darktheme-auth-fastapi.svg',
        githubUrl: 'https://github.com/georgekhananaev/darktheme-auth-fastapi-server',
        featured: false,
        daysAgo: 110,
        metaTitle: 'Dark Theme Auth FastAPI Server — Production Python API template',
        metaDescription:
            'Production-ready FastAPI template with JWT RS256 authentication, Redis caching, structured logging, Pydantic v2, and a custom dark-themed Swagger UI. Clone, rename, ship.',
        seoKeywords: ['fastapi template', 'python api starter', 'jwt rs256', 'redis caching', 'structured logging', 'pydantic v2', 'dark swagger ui', 'docker compose', 'pytest', 'production fastapi'],
        about: ['FastAPI', 'Python', 'Redis', 'JWT', 'API templates'],
        mentions: ['Pydantic', 'Docker', 'Swagger UI', 'RS256', 'Structured logging'],
    },
];

// ---------------------------------------------------------------------------
// Commercial portfolio seeds
// Paid engagements delivered to clients / employers. No GitHub URLs.
// Copy is NDA-safe: names only disclosable companies, focuses on architecture
// and outcomes rather than internal business data.
// ---------------------------------------------------------------------------

const commercialSeeds = [
    {
        slug: 'travel-panel-core-platform',
        title: 'Travel Panel: the core travel management platform',
        subtitle: 'FastAPI backend, Next.js operator portal, and B2B partner portal powering Moon Holidays end to end',
        excerpt:
            'Travel Panel is the core system at Moon Holidays. A FastAPI backend, a Next.js operator portal, a B2B partner portal, and the orchestrator for every downstream product: TravelOffer for end customers, Live Deck for call-center TVs, Vercel Controller for deployment cache, StaySync for allotment availability, and a WebSocket messenger for internal communication. Running on AWS with ALB, MemoryDB, CloudFront, S3, and more.',
        content: `## Overview

Travel Panel is the **core system** at Moon Holidays. Not a single repo, not a single service, but the orchestrator that every other product either feeds data into or consumes data from. When I say "core", I mean it literally: nothing else in the Moon Holidays engineering organization ships without touching Travel Panel. [I](/) designed and built it from zero in December 2022 and have led it since. The code carries a proprietary license in my name going back to 2023.

## The Travel Panel ecosystem

Travel Panel is the hub. Six other products connect to it and depend on it:

| Product | What it does | How it connects |
|---|---|---|
| **Travel Panel operator portal** | Internal admin dashboard used daily by the whole ops team | Direct client of the FastAPI backend |
| **Travel Panel B2B portal** | External partner agencies browse and book inventory | Direct client with partner-scoped permissions |
| **[TravelOffer](/portfolio/traveloffer-multi-brand-booking)** | Customer-facing booking flow for end travelers (itineraries, flights, hotels, transportation, payments) | Reads inventory and pricing from Travel Panel, writes bookings back |
| **[Live Deck](/portfolio/live-deck-call-center-dashboard)** | Wall-mounted call-center TV dashboard, controlled and fed data by Travel Panel | Consumes metrics and live data from Travel Panel plus Aircall telephony |
| **[Vercel Controller](/portfolio/vercel-controller-async-ops-proxy)** | Invalidates CDN cache and triggers redeploys when Travel Panel data changes | Travel Panel calls it whenever content updates require a frontend refresh |
| **[StaySync](/portfolio/staysync-b2b-hotel-allotment)** | B2B hotel allotment, availability checks, and hardblock management | Syncs with Travel Panel for inventory and availability |
| **[Travel Panel WebSocket Server](/portfolio/travelpanel-websocket-server)** | Real-time internal messaging between operators, notifications, chat | Consumes Travel Panel events via Redis pub/sub, fans them out to connected clients |
| **[Moon Support Hub](/portfolio/moon-support-hub-leadership)** | Enterprise support ticketing platform | Built alongside the core platform; shares the same identity and notification layer |

Each of those systems has its own repo and its own case study in this portfolio. They all share one thing: Travel Panel is upstream of them.

## The three core repositories

- **travelpanel-fastapi** — the Python backend. The heart of the system. Serves everything downstream.
- **travelpanel-nextjs** — the internal operator portal. A full admin dashboard used every day by the whole operations team.
- **travelpanel-b2b-nextjs** — the newer B2B partner portal for external travel agencies who resell Moon Holidays inventory.

## What it manages

Travel Panel is a complete travel management system for travel agencies and tour operators:

- **Hotels** — listings, room inventory, availability, contract management, hotel ID uniqueness system, positional updates for room order preservation
- **Attractions** — activity listings, availability, ticket/service breakdown, multi-currency support
- **Flights** — domestic and international, baggage details, operator images, per-passenger pricing
- **Transportation** — transfers, rentals, transit services with grouped currency display, route details
- **Financial tools** — transactions v2, refunds, reports, analytics, reconciliation, multi-gateway payment processing
- **Customer relationship management** — profiles, history, preferences, communication history
- **Itinerary builder** — custom multi-product itineraries for customers
- **User management** — role-based access across agents and administrators
- **File manager** — centralized S3-backed file storage and management
- **Multi-brand + multilingual** — serves multiple brands under the group, in English, Hebrew, and other languages

## Architecture

### Backend (travelpanel-fastapi)

Python and FastAPI. Strong typing with Pydantic, automatic OpenAPI schema generation, async by default. Uvicorn with workers in production.

**MongoDB** as the primary data store (Atlas in production, local Docker in dev). The travel domain is document-shaped by nature: itineraries are nested trees of offers, passengers, rooms, and extras. Connection manager follows the singleton-with-global-caching pattern so serverless cold starts stay cheap.

**Valkey cluster** — a 6-node Redis-compatible in-memory data store. Used for caching, pub/sub, session storage, and distributed locks. Switched from single-node Redis to the cluster because horizontal scale across multiple FastAPI workers needed shared state that can tolerate writer failover.

**AWS MemoryDB cluster** in production, for the Redis-compatible workloads that need managed persistence and automatic failover. The dev stack uses local Valkey; prod uses MemoryDB behind the same client code.

**Firebase Admin SDK** for JWT authentication, bridging the operator portal, the B2B portal, and every downstream product (WebSocket server, Live Deck, Support Hub).

**Docker everywhere.** Dev and prod both run in Docker Compose. Nothing in the codebase assumes a specific cloud provider. \`dev.sh\` automates the full local setup including an optional database restore from a dated backup. Production runs with \`docker-compose build --no-cache && docker-compose up -d\`.

**Integrations**: Live Agent customer support (via \`thaitours.ladesk.com/api/v3\`), Firebase for file storage, and adapter-isolated integrations with Agoda, Booking.com, and every other supplier / vendor connected to the platform.

Testing: pytest against a running FastAPI server. For a smaller open-source FastAPI reference I maintain, see [FastAPI DocShield](/portfolio/fastapi-docshield) (auth-protected docs endpoints) and [Dark Theme Auth FastAPI Server](/portfolio/darktheme-auth-fastapi-server) (full JWT + Redis template).

### Operator portal (travelpanel-nextjs)

Next.js **15.3.4** with React, **Material-UI v7**, Emotion for CSS-in-JS, and a mature state layer combining **React Query (TanStack Query v5)**, Context API, and Redux. The API layer is Axios with retry capabilities.

**Auth**: Firebase Auth with role-based controls. JWT sessions. Multiple auth contexts for Firebase, JWT, and fallbacks.

**Forms**: Formik with Yup/Zod validation.

**Reporting and visualization**: ApexCharts and Recharts, Mapbox for geographic UI.

**Payments**: Stripe and Omise — two processors in parallel for regional coverage. The portal handles gateway selection per transaction.

**Content**: Quill rich-text editor for operators who write long-form updates.

**Storage**: AWS S3 for file management (operator uploads, customer documents, hotel media).

**External integrations** wired in via NEXT_PUBLIC_ flags: OpenAI (for AI-assisted workflows), LiveAgent, Salesforce, Google Ads, Google Analytics 4, Aircall call analytics, Mapbox, feature flags for maintenance mode and analytics toggles.

**Testing**: Vitest + React Testing Library. **236 test cases** across unit, component, and integration layers. FormFieldsBuilder logic alone has 56 tests covering key props, permissions, field formatting, and business logic. Refunds and Transactions SearchFilter components each have 25 tests covering toggle buttons, themes, and accessibility.

**61 API endpoints** documented in the API implementation guide. The system-features summary covers 15 distinct patterns (TanStack Query guide, hotel API implementation, WebSocket system, table-with-filters pattern, settings dialog patterns, Google Ads OAuth setup, and more).

**Three-tier deployment flexibility**: default Docker config, Node.js 24 Alpine (lightweight), Bun runtime (high-performance). Each uses different container names so multiple versions can run simultaneously.

**License**: © 2023-2025 George Khananaev, proprietary. "Owner & Lead Developer" per the README contributors section.

### B2B partner portal (travelpanel-b2b-nextjs)

The newest piece. A partner portal for external travel agencies running on the **Bun runtime** (oven/bun:1-alpine), making it the first Moon Holidays service to go production on Bun. It has a **polyglot data layer** unique in the portfolio: **MongoDB 8** for document data, **PostgreSQL 18** for relational records (partner agreements, commission structures, financial ledgers), and **Redis 8** for caching and session state. Docker Compose development with named volume persistence and hot reload via source code bind-mounts.

## AWS infrastructure

Travel Panel runs on AWS in production. The stack is deliberately cloud-native where it helps and deliberately cloud-agnostic where it matters:

- **Application Load Balancer** — terminates TLS, routes traffic to the FastAPI backend and the Next.js frontends, health-checks every service, and handles SSL certificate rotation automatically via ACM.
- **AWS MemoryDB for Redis** — a managed Redis-compatible cluster with multi-AZ failover and durability. The dev stack runs a local Valkey cluster for the same client code; prod points at MemoryDB. Client code never changes between environments.
- **CloudFront CDN** — caches static assets, images, and API responses where appropriate. Origin shield in front of S3 buckets reduces egress cost and smooths traffic spikes.
- **S3 buckets** — file storage for operator uploads, customer documents, hotel media, invoices, receipts, and signed PDF output. Lifecycle policies move cold content to cheaper tiers automatically.
- **MongoDB Atlas** — primary document store, multi-region replica set, with the FastAPI backend connected via private network.
- **Secrets Manager / Parameter Store** — every credential and API key lives here, not in env files.
- **CloudWatch** — metrics, logs, and alarms for the whole platform. Every service publishes structured JSON logs.
- **Route 53** — DNS and health-check-based failover.

When Travel Panel content changes — a new offer published, a hotel updated, inventory adjusted — the backend calls the **Vercel Controller** service to purge CloudFront cache for the affected paths and trigger a redeploy of the dependent frontends. That way the CDN, the Vercel deployments, and the Travel Panel data stay coherent without manual intervention.

The dev stack still runs in Docker Compose and is infrastructure-agnostic. Nothing in the codebase is hard-coded to AWS: the container image that runs in production on MemoryDB + S3 + CloudFront is the same container image that runs in dev against local Valkey and local file storage. Moving to GCP or Oracle Cloud is a config change, not a refactor.

## The integration layer

Travel Panel is connected to dozens of external services. Each integration is isolated behind an adapter so failures do not cascade and swapping a vendor stays a localized change.

Agoda, Booking.com, and supplier inventory APIs. Google Cloud services. Cloudflare. Twilio for SMS and voice. Firebase for push notifications, file storage, and real-time features. AWS for S3, Cognito, and infrastructure. Real-time currency exchange feeds. Stripe and Omise for payment processing. Live Agent for customer support workflows. OpenAI for AI-assisted operator tools. Google Ads API with OAuth2 for campaign analytics. Salesforce CRM analytics. GA4 analytics. Aircall for phone analytics.

## Documentation discipline

Travel Panel carries an unusually thorough documentation set for an internal platform, stored alongside the code: API Implementation Guide (43KB), MongoDB Implementation Guide (31KB), Theme and Design Guide (38KB), Testing Guide (44KB), File Structure Guide (31KB), NEXT.js API Best Practices (69KB), plus 16 feature-specific guides and 23 section-specific guides. This is deliberate. When a team grows, tribal knowledge breaks. Writing things down once saves days of onboarding per engineer.

## Operational reality

Travel Panel has been running in production since I started at Moon Holidays in late 2022. Every product in the suite has been added on top of it: the [TravelOffer](/portfolio/traveloffer-multi-brand-booking) customer booking flow, the [Live Deck](/portfolio/live-deck-call-center-dashboard) call-center dashboard, [Moon Support Hub](/portfolio/moon-support-hub-leadership), [StaySync](/portfolio/staysync-b2b-hotel-allotment) for B2B allotment management, the real-time [WebSocket server](/portfolio/travelpanel-websocket-server), the [Vercel deployment controller](/portfolio/vercel-controller-async-ops-proxy). Each one of those exists because Travel Panel made it cheap to add a new product instead of a new platform.

## What I learned building this

**Get the data model right on day one.** Every shortcut taken in the tenancy model or the core entity shapes costs ten times as much to undo later. Travel Panel is multi-tenant from the first commit: every record belongs to a tenant, every query filters by tenant, every background job scopes to tenant. That discipline paid back immediately and continues to pay back every time a new product needs to share the data layer.

**Own your integration boundary.** Every external API is a liability the moment your business depends on it. Put it behind an adapter you control, test the adapter, and wrap every call with retries, timeouts, and observability. You will thank yourself the first time an upstream provider has a bad day.

**Treat the platform as a product.** Internal tools that will be used every day by real operators deserve the same design discipline as customer-facing software. The operator portal at Moon Holidays is not a back-office CRUD app. It is the product the company runs on, and it reflects that investment.

**Write the docs as you go.** Travel Panel's docs folder is as big as some projects' source trees. The payoff is that new engineers can onboard by reading instead of asking, and architectural decisions are captured while the reasoning is still fresh.

## Tech stack

**Backend**: Python, FastAPI, Pydantic, MongoDB, Valkey cluster (6 nodes, Redis-compatible), AWS MemoryDB for production, Firebase Admin SDK, Uvicorn, Docker, Docker Compose, pytest.

**Operator portal**: Next.js 15.3.4, React, Material-UI v7, Emotion, TanStack Query v5, Redux, Context API, Axios, Firebase Auth, Formik, Yup, Zod, ApexCharts, Recharts, Mapbox, Stripe, Omise, Quill, AWS S3, Vitest, React Testing Library.

**B2B portal**: Next.js, Bun runtime, MongoDB 8, PostgreSQL 18, Redis 8, Docker Compose.

**Shared infrastructure**: multi-tenant data model, role-based access control, infrastructure-agnostic deployments, external integration layer isolated behind adapters, 74+ pages of internal architecture documentation.`,
        tags: ['fastapi', 'nextjs', 'python', 'typescript', 'mongodb', 'valkey', 'aws', 'multi-tenant', 'saas', 'architecture', 'platform', 'orchestration'],
        category: 'Case Study',
        thumbnailFile: 'travel-panel.svg',
        clientName: 'Moon Holidays',
        clientUrl: 'https://moonholidays.co.th',
        engagementPeriod: 'Dec 2022 — Present',
        role: 'Head of Development & IT Infrastructure',
        deliverables: [
            'FastAPI backend (core API) feeding every downstream product',
            'Next.js operator portal (travelpanel-nextjs)',
            'B2B partner portal with polyglot data layer (travelpanel-b2b-nextjs)',
            'Orchestration layer for TravelOffer, Live Deck, Vercel Controller, StaySync, and WebSocket messenger',
            'AWS production infrastructure: ALB, MemoryDB, CloudFront, S3, MongoDB Atlas, CloudWatch',
            'Multi-tenant data model and role-based access control',
            'Integration adapters for dozens of external services',
        ],
        publishedAt: new Date('2022-12-01T00:00:00Z'),
        featured: true,
        pinned: true,
        metaTitle: 'Travel Panel — FastAPI + Next.js multi-tenant travel platform',
        metaDescription:
            'Travel Panel is the core system at Moon Holidays: FastAPI backend, Next.js operator and B2B portals, multi-tenant architecture, AWS infrastructure (ALB, MemoryDB, CloudFront, S3), and orchestration for TravelOffer, Live Deck, WebSocket, StaySync, Vercel Controller, and Support Hub.',
        seoKeywords: ['travel panel', 'moon holidays platform', 'multi-tenant saas', 'fastapi nextjs architecture', 'python typescript platform', 'aws memorydb cloudfront', 'valkey cluster', 'travel management system', 'b2b booking portal', 'orchestration layer', 'mongodb atlas', 'agoda booking.com integration'],
        about: ['FastAPI', 'Next.js', 'MongoDB', 'AWS', 'Multi-tenant architecture', 'Travel management software', 'Python', 'TypeScript', 'Valkey'],
        mentions: ['AWS MemoryDB', 'CloudFront', 'Application Load Balancer', 'S3', 'Docker', 'Firebase Admin SDK', 'Stripe', 'Omise', 'Mapbox', 'Agoda', 'Booking.com', 'Twilio', 'Pydantic', 'React Query', 'Bun', 'PostgreSQL'],
    },
    {
        slug: 'traveloffer-multi-brand-booking',
        title: 'TravelOffer: a multi-brand travel booking platform',
        subtitle: 'Next.js 16.1 + MongoDB booking flow with trilingual RTL/LTR support, state-machine order flow, and Stripe payments',
        excerpt:
            'A production Next.js 16 booking platform serving multiple brands under one codebase. Trilingual (English, Arabic, Hebrew) with full RTL/LTR support, cookie-based brand switching, a six-layer architecture, 30+ currency symbols, SMS/WhatsApp/Email/Google OAuth login, and a state-machine order flow from confirm to payment to completed.',
        content: `## Overview

Moon Holidays needed a booking platform that could serve multiple brands under the group umbrella, speak three languages (English, Arabic, Hebrew) with full RTL/LTR handling, and cover every step of the travel booking flow from search to payment. TravelOffer is what [I](/) designed and built, sitting on top of the [Travel Panel core platform](/portfolio/travel-panel-core-platform) that powers every Moon Holidays product.

## What it does

End-to-end travel booking. The customer lands on \`/start\` to pick an offer, navigates \`/location/[from]/[to]/[slug]/[item]\` to explore hotels, attractions, and transportation, selects a flight at \`/flight/[slug]\`, compares alternatives at \`/select-offer\`, and moves through the checkout state machine: \`/order/confirm\` → \`/order/payment\` → \`/order/completed\`. Authentication supports SMS, WhatsApp, Email, and Google OAuth. The same codebase serves every brand in the group through cookie-based brand switching and a dynamic theming system, so a new brand spins up without forking the app.

## Architecture

TravelOffer uses a deliberate **three-layer architecture** that every feature must respect:

\`\`\`
UI Layer (Pages & Components)
        ↓
Action Layer (_actions) — Thin wrappers for client access
        ↓
Server Layer (_server) — Validation and business logic
        ↓
Data Layer (_data) — Database and API access
        ↓
Model Layer (_models) — Mongoose schemas
        ↓
MongoDB Database
\`\`\`

Each layer communicates only with adjacent layers. No cross-cutting shortcuts. The discipline comes from learning what happens in a large codebase when layers bleed into each other: every bug hides in the seams, every change ripples unpredictably, every refactor requires rewriting things twice.

### Key patterns in production

- **Repository pattern** for data-layer access. Every Mongoose model has a repository that owns reads and writes.
- **Server Actions** as thin client-accessible wrappers for server-side mutations, following the Next.js 16 pattern.
- **Customer status state machine**: \`pending → viewing → confirmed → paid\`. Transitions are explicit and enforced at the server layer.
- **Multi-brand data model**: brand is a first-class concept, not a runtime config toggle. Cookie-based switching, environment-variable fallback, and configuration in \`_data/brand.ts\`.

## Next.js 16 session management

Session handling uses the Next.js 16 **\`proxy.ts\` deny-by-default pattern**. Routes are protected unless explicitly marked public. Authentication generates OTP codes for SMS/WhatsApp/Email flows, hashes credentials with bcrypt, integrates Google OAuth, and logs every access.

## Internationalization that works

next-intl powers the i18n layer. The app ships in English, Arabic, and Hebrew. RTL and LTR are not just a CSS flip: every component has \`dir="auto"\` handling for mixed-language content, CSS \`truncate\` for text overflow direction awareness, and locale-specific routing. This is the part most multi-language projects underestimate. I ended up writing small wrapper components that imposed consistent direction handling, which saved us every time a new feature arrived.

## Multi-currency at the UI level

Per-service currency handling with **30+ currency symbols**. The \`groupServicesByCurrency()\` utility and \`GroupedCurrencyDisplay\` component render single or stacked price displays when an itinerary spans multiple currencies (flights in USD, hotels in THB, attractions in EUR). The fallback currency is configurable per brand.

## Payments and security

**Stripe** for payment processing with webhook verification and idempotency. **bcrypt** for password hashing. **DOMPurify** for XSS sanitization on user-generated content. Comprehensive Zod validation at every API route. Error Boundaries with graceful custom fallback UI on all major routes.

## Performance optimizations

Suspense boundaries, memoization, debounced validation, dynamic imports, image optimization via Next.js with remote CDN wildcard hostname, and a 4 MB body size limit on Server Actions for file uploads. Bundle analyzer wired into \`npm run analyze\` so every release checks its own weight.

## UI details that took time to get right

**Four modal transition types** (fade, zoom, slide, grow) with fixed or floating close buttons. Animated modals are a detail most apps skip, but a high-friction booking flow benefits from momentum in the small interactions. **Mobile-first responsive design** with separate mobile and desktop layouts for complex components like flight selectors and hotel galleries.

## Testing

**Playwright** for end-to-end testing. The booking flow has enough edge cases — expiring sessions, partial form state, payment failures, upstream API outages — that unit tests alone give false confidence.

## Tech stack

Next.js 16.1.2 with App Router and Turbopack, React 19.2.3, TypeScript (strict mode), Tailwind CSS, Material-UI 7.3.7, MongoDB, Mongoose ODM, Jose (JWT), Google OAuth, Stripe (server + client SDKs), next-intl, React Hook Form, Zod, bcrypt, DOMPurify, Playwright, Pino, Framer Motion, @mui/material, @emotion/react, mui-tel-input, google-libphonenumber, react-hot-toast, react-photo-view, react-signature-canvas.

## Takeaway

Multi-brand theming sounds simple on paper: swap colors and logos per tenant. In practice it touches routing, metadata, analytics, emails, payment receipts, and error pages. Getting it right meant treating the brand as a first-class concept in the data model instead of a runtime config toggle, and writing direction-aware wrappers around every component the moment we hit the first RTL bug.

For a simpler open-source starter that uses many of the same patterns (Next.js frontend, FastAPI backend, JWT auth, role-based access), see [PyNextStack](/portfolio/pynextstack), which I maintain as a reference implementation you can fork and ship.`,
        tags: ['nextjs', 'typescript', 'mongodb', 'stripe', 'i18n', 'rtl', 'react', 'multi-tenant', 'state-machine'],
        category: 'Case Study',
        thumbnailFile: 'traveloffer.svg',
        clientName: 'Moon Holidays',
        clientUrl: 'https://moonholidays.co.th',
        engagementPeriod: 'Jul 2025 — Present',
        role: 'Head of Development',
        deliverables: [
            'End-to-end booking flow',
            'Multi-brand theming system',
            'Trilingual RTL / LTR support',
            'Stripe payment integration',
            'Custom JWT + Google OAuth',
        ],
        publishedAt: new Date('2025-07-28T00:00:00Z'),
        featured: true,
        metaTitle: 'TravelOffer — Multi-brand Next.js 16 travel booking platform',
        metaDescription:
            'TravelOffer is a Next.js 16 booking platform with trilingual RTL/LTR (English, Arabic, Hebrew), state-machine order flow, Stripe payments, MongoDB + Mongoose, 30+ currencies, and a three-layer architecture.',
        seoKeywords: ['traveloffer', 'nextjs 16 booking', 'multi-brand travel', 'rtl ltr arabic hebrew', 'stripe integration', 'mongodb mongoose', 'next-intl i18n', 'jwt jose', 'google oauth', 'react 19', 'typescript strict', 'travel itinerary builder', 'moon holidays'],
        about: ['Next.js', 'React', 'MongoDB', 'Stripe', 'Multi-brand platforms', 'Internationalization', 'TypeScript'],
        mentions: ['Mongoose', 'Jose', 'Google OAuth', 'Tailwind CSS', 'Material-UI', 'React Hook Form', 'Zod', 'Playwright', 'Pino', 'Framer Motion', 'next-intl', 'bcrypt', 'DOMPurify'],
    },
    {
        slug: 'travelpanel-websocket-server',
        title: 'Travel Panel WebSocket Server: real-time at uWebSockets.js speed',
        subtitle: 'High-performance WebSocket gateway for notifications, chat, and live state, running on port 8965 since August 2025',
        excerpt:
            'A high-throughput WebSocket server powering every live update across the Moon Holidays platform. Built on uWebSockets.js for raw performance, with MongoDB for persistence, Redis for pub/sub across pods, Firebase Auth for handshakes, and rate limits of 1000 msg/min in dev and 120 msg/min in production.',
        content: `## Overview

[Travel Panel](/portfolio/travel-panel-core-platform) needed live updates. New bookings had to appear in operator tabs the moment they were created. Chat messages between staff had to feel instant. System alerts had to reach every active session across the whole platform. [I](/) built the WebSocket server that powers all of that, running on port **8965** in every environment since August 2025.

## Why uWebSockets.js

The obvious choice is ws or socket.io. They are easy, they are popular, and they are fine for small loads. They are also ten to fifteen times slower than uWebSockets.js under serious traffic. For a system that has to serve every active Moon Holidays user session at once, raw throughput matters. uWebSockets.js is a C++ WebSocket server with Node bindings, and it is the fastest thing on the JavaScript runtime.

## Architecture

uWebSockets.js as the transport, wrapped in a thin TypeScript layer for application logic.

**MongoDB** for persistence of delivered messages, chat history, and subscription state. A single MongoDB URL covers both databases the service needs.

**Redis** for pub/sub and fan-out across multiple WebSocket server processes. Any backend service in the Moon Holidays platform can publish to Redis and every connected client sees the message.

**Firebase Admin SDK** for handshake authentication: every socket verifies its token before it is allowed to subscribe. Clients connect with \`ws://host:8965/ws/{firebase-token}\`.

**Tenant-scoped fan-out** enforced at the gateway layer, so a message for one tenant never leaks to another.

## API surface

HTTP endpoints alongside the WebSocket transport:

- \`GET /api/auth/me\` — current user
- \`GET /api/auth/verify\` — verify token
- \`GET /api/users/online\` — list online users
- \`GET /api/users/search?q=\` — search users
- \`GET /api/users/by-email/:email\` — lookup by email
- \`POST /api/chat/send\` — send message
- \`GET /api/chat/history\` — message history
- \`GET /api/chat/rooms\` — user's rooms
- \`POST /api/chat/messages/mark-read\` — mark messages as read
- \`POST /api/notifications\` — send notification
- \`GET /api/notifications\` and \`/unread-count\`
- \`GET /health\`, \`GET /metrics\`

## WebSocket actions

The message envelope is \`{action, data}\`. Supported actions:

- \`chat\` — send chat message
- \`notification\` — send notification
- \`presence\` — update presence status
- \`ping\` / \`pong\` — keep-alive
- \`get_connected_users\` — list online users
- \`fetch_unacknowledged_notifications\` — retrieve pending notifications
- \`acknowledge_notification\` — mark as read

## Rate limits and connection ceilings

Rate limits differ by environment because dev workloads need headroom for testing while production needs abuse protection:

| Setting | Dev | Production |
|---|---|---|
| Messages per minute | 1000 | 120 |
| Connection attempts per minute | 500 | 200 |
| Max connections per user | 10 | 10 |
| Idle timeout (seconds) | 120 | 120 |

## Dev vs production

Dev connects to an external Redis from the \`travelpanel-fastapi\` Docker network for shared state with the rest of the platform, hot-reloads via \`tsx watch\`, and runs with \`LOG_LEVEL=debug\`. Production uses a bundled Redis container with persistence, compiled JS, and \`LOG_LEVEL=info\`.

## Project structure

\`\`\`
uws-server/
├── src/
│   ├── index.ts          # Entry point
│   ├── app.ts            # App setup
│   ├── config.ts         # Configuration
│   ├── handlers/         # HTTP & WebSocket handlers
│   ├── services/         # Business logic
│   ├── database/         # MongoDB & Redis
│   └── middleware/       # Rate limiting, etc.
├── tests/                # Unit tests
├── Dockerfile            # Production image
└── Dockerfile.dev        # Development image
\`\`\`

## Production reality

The server has been running in production since launch. Uptime is effectively continuous. Occasional Redis version bumps, a handful of TypeScript refactors as the feature set grew, and very little else. The fastest way I know to end up with a reliable system is to start with a small number of correct primitives and resist the urge to decorate them.

## Tech stack

Node.js 20 LTS, TypeScript, uWebSockets.js, MongoDB, Redis, Firebase Admin SDK, Docker, Docker Compose.

## Takeaway

Real-time is less about "how fast can you push bytes" and more about "what happens when things go wrong". Reconnection, message replay, authenticated handshakes, pub/sub across pods, graceful shutdown, rate limiting, per-user connection ceilings, idle timeouts. If all of those work, the WebSocket bit takes care of itself.`,
        tags: ['websocket', 'uwebsockets', 'nodejs', 'typescript', 'mongodb', 'redis', 'realtime', 'rate-limiting'],
        category: 'Technical Deep-Dive',
        thumbnailFile: 'realtime-websocket.svg',
        clientName: 'Moon Holidays',
        clientUrl: 'https://moonholidays.co.th',
        engagementPeriod: 'Aug 2025 — Present',
        role: 'Engineering Team Lead',
        deliverables: [
            'uWebSockets.js gateway',
            'Tenant-scoped fan-out',
            'Redis pub/sub for horizontal scale',
            'Firebase-authenticated handshake',
            'Reconnect + message replay',
        ],
        publishedAt: new Date('2025-08-16T00:00:00Z'),
        featured: true,
        metaTitle: 'Travel Panel WebSocket Server — uWebSockets.js at production scale',
        metaDescription:
            'High-performance WebSocket gateway built on uWebSockets.js with MongoDB, Redis pub/sub across pods, Firebase Admin SDK handshakes, and rate limits of 1000 msg/min in dev and 120 msg/min in production.',
        seoKeywords: ['uwebsockets.js', 'nodejs websocket server', 'real-time notifications', 'redis pub sub', 'websocket scaling', 'firebase auth websocket', 'chat server', 'websocket rate limiting', 'travel panel websocket', 'moon holidays', 'tenant-scoped fanout'],
        about: ['uWebSockets.js', 'Node.js', 'WebSocket', 'Redis', 'Firebase Admin SDK', 'Real-time systems'],
        mentions: ['MongoDB', 'Docker Compose', 'Pub/sub', 'Rate limiting', 'Message replay', 'Graceful shutdown'],
    },
    {
        slug: 'moon-support-hub-leadership',
        title: 'Moon Support Hub: an enterprise ticketing platform',
        subtitle: 'Next.js 16 with Prisma on MongoDB, 740+ source files, 186 React components, 135+ API endpoints, 60 models, and 14 scheduled background jobs',
        excerpt:
            'Moon Support Hub is a full-featured enterprise support system: ticketing with SLA management, a knowledge base with publishing workflow, role-based access control, MinIO attachments, and a customer portal. Built on Next.js 16 with Prisma on MongoDB, 740+ source files, 186 React components, 135+ API endpoints, 60 models, 14 scheduled background jobs, and 8 pre-built reports.',
        content: `## Overview

Moon Support Hub is a full-featured enterprise support system built alongside the [Travel Panel core platform](/portfolio/travel-panel-core-platform). Ticketing with lifecycle management, knowledge base with a draft-to-published workflow, SLA policies, agent workload balancing, eight role-based access levels, real-time notifications, eight pre-built reports, and a customer portal for self-service.

By the numbers:

| Metric | Count |
|---|---|
| Source files | 740+ |
| React components | 186 |
| API endpoints | 135+ |
| Database models | 60 |
| Seed files | 30 |
| Built-in roles | 8 |
| Report types | 8 |
| Background jobs | 14 |

[My](/) role on this project was **engineering lead**. I did not write the bulk of the code. I drove the architecture, reviewed every pull request, and kept the product on track.

## Architecture

\`\`\`
Clients (Browser, Mobile)
  ↓
Next.js Application [:3000]
  ├── Frontend: App Router Pages, React Components, 4 Themes (Light, Dark, Moon, Green)
  └── Backend: REST API (135+ endpoints), SSE Streams (3 channels), Background Jobs (14 tasks)
  ↓
Authentication Layer
  ├── Firebase Auth (Google, GitHub, Microsoft, Apple OAuth)
  ├── Local Auth (JWT Sessions)
  └── Office System API (external user/role sync)
  ↓
Data Layer
  ├── MongoDB 5.0 Replica Set (:27017)
  ├── Prisma ORM (60 models)
  └── MinIO S3 (API :9000, Console :9001)
  ↓
Communication: Mailpit SMTP (:1025, UI :8025)
\`\`\`

**Prisma on MongoDB** is the first surprising choice. Most teams reach for Mongoose when they commit to MongoDB. Prisma's MongoDB support lets us get type-safe queries, schema migration, and a single source of truth for all 60 models — trading flexibility for discipline in a codebase that has to be maintained by a team rather than a solo engineer.

## What the system does

### Ticket management
Full lifecycle: create, track, assign, resolve, close tickets with complete audit trail. Configurable workflow (Open → In Progress → Pending → Resolved → Closed). Multi-channel intake (Email, Phone, Web, Chat, API). Merge related tickets and split complex ones with selective comment copying. Timer-based time tracking with session entries. Dynamic SLA due dates based on business hours. Automated escalation. File attachments via MinIO with presigned URLs. Gantt timeline view via Frappe Gantt. Full-text search. Bulk operations.

### Comments and collaboration
Threaded nested replies, @mentions with real-time notifications, rich-text markdown editor, per-comment file attachments, upvote/downvote tracking, system comments for status changes, and canned responses with keyboard shortcuts.

### Knowledge base
Multiple KBs organized by product or domain with department access control. Complete version history with author tracking. Publishing workflow: Draft → In Review → Approved → Published → Archived. Visibility controls (Public, Internal, Role-based). Article ratings (1-5 stars) with admin responses. Related articles. KB attachments with thumbnail generation. Search analytics including zero-result detection and content-gap reports. Self-service deflection measurement. KB session tracking with time-on-page. SEO metadata per article. Automatic article expiration.

### RBAC (Role-Based Access Control)
Eight built-in roles: Administrator, Department Manager, Category Manager, Type Manager, Support Agent, Customer, Viewer, Employee. Three layers of enforcement:

1. **Page Permissions** — which roles can access which pages
2. **UI Element Permissions** — four levels (none / view / interact / full)
3. **API Permissions** — endpoint protection by permission code

Plus **Office Role Mapping** for auto-assigning roles from external HR systems.

### 14 scheduled background jobs

| Job | Schedule | Purpose |
|---|---|---|
| master-scheduler | 1 min | Orchestrates all jobs |
| aggregate-daily-stats | Hourly | 30-day ticket statistics |
| aggregate-interval-stats | Hourly | 24-hour statistics |
| aggregate-performance-stats | Hourly | SLA compliance metrics |
| aggregate-team-stats | Hourly | Team workload snapshot |
| aggregate-analytics-stats | Hourly | Comprehensive analytics |
| check-escalations | 5 min | Apply escalation rules |
| auto-assign-tickets | 2 min | Distribute unassigned tickets |
| calculate-burning-rates | Hourly | Agent productivity metrics |
| aggregate-customer-trends | Hourly | Customer behavior patterns |
| aggregate-csat-stats | Hourly | Satisfaction metrics |
| aggregate-kb-analytics | Hourly | Knowledge base metrics |
| send-scheduled-reports | Configurable | Daily/weekly/monthly email delivery |
| cleanup-attachments | Daily | Remove orphaned files |

Jobs are database-driven with dynamic scheduling (interval, cron, daily, weekly, monthly), timezone-aware, with execution tracking, failure logging, and manual triggering. When a job fails, it lands in a failure log with the error for an operator to triage.

### Real-time SSE streams

Three SSE channels, not one big firehose:

- \`GET /api/notifications/stream\` — user notifications (mentions, assignments, updates)
- \`GET /api/tickets/stream\` — live ticket count updates for sidebar badges
- \`GET /api/system-config/stream\` — system-wide config broadcasts so settings propagate without page reloads

Splitting streams by concern means clients subscribe only to what they care about, and a noisy config channel does not delay an urgent notification.

### 8 pre-built reports

Executive Dashboard, Agent Performance, Team Reports, Customer Trends, SLA Performance, Knowledge Base, Ticket Operations, CSAT. Each has pre-aggregated hourly statistics for fast dashboard loading and can be subscribed to for scheduled email delivery (daily / weekly / monthly / quarterly / yearly). HTML email reports include embedded Recharts-generated charts.

### Content richness
Markdown support with Mermaid diagrams, KaTeX math notation, Monaco editor for code content, Mammoth for Word document import, and PDF to PNG conversion.

### Customer portal
My Tickets view, multi-step ticket creation with KB article suggestions, knowledge search for self-service, and post-resolution CSAT surveys with emoji rating scale and optional text feedback.

## My role as lead

**Architecture**. I chose the stack (Next.js 16, MongoDB 5.0 Replica Set, Prisma, Firebase Auth, MinIO, Mailpit, Docker orchestration), designed the data model across 60 Prisma schemas, set the boundaries between subsystems, and decided which parts to build custom versus reach for libraries.

**Code review**. Every pull request, every iteration. I maintained the coding standards and architectural coherence as the team added features. Most of my PR comments were about consistency: naming, data shapes, error handling, RBAC application, and tests. Any one of those is minor in isolation. Together they are the difference between a codebase you can evolve for years and one that becomes a liability in six months.

**Roadmap planning**. Prioritization, breaking features into shippable milestones, and keeping stakeholders aligned on what would land when.

**Mentorship**. Pairing with developers on the hard parts, especially around the permission layers, the background-job scheduler, the SSE stream design, and the publishing workflow state machine.

## Lessons from leading instead of building

The most useful thing a lead can do is ensure the team does not paint itself into a corner. The second most useful thing is saying no. Engineers want to build every feature the customer asks for. A lead's job is to decide which ones actually move the product forward and which ones introduce complexity that will cost more than they pay back.

## Tech stack (chosen and reviewed, not primarily authored)

Next.js 16, TypeScript, Prisma ORM, MongoDB 5.0 Replica Set, Firebase Authentication (Google, GitHub, Microsoft, Apple, Local), MinIO S3, Mailpit SMTP (dev) and production SMTP, SSE, Recharts, Docker Compose, Mermaid, KaTeX, Monaco editor, Mammoth (Word import), 4 themes (Light, Dark, Moon, Green).

For an open-source reference implementation of the FastAPI + Redis + JWT auth patterns we used on the backend side of similar projects, see [Dark Theme Auth FastAPI Server](/portfolio/darktheme-auth-fastapi-server).

**License**: MoonHolidaysThai Co., Ltd.`,
        tags: ['leadership', 'nextjs', 'mongodb', 'prisma', 'firebase', 'rbac', 'enterprise', 'minio'],
        category: 'Case Study',
        thumbnailFile: 'support-hub.svg',
        clientName: 'Moon Holidays',
        clientUrl: 'https://moonholidays.co.th',
        engagementPeriod: 'Dec 2025 — Present',
        role: 'Engineering Lead (architecture and delivery oversight)',
        deliverables: [
            'Architecture and data model',
            'Stack selection (Next.js, MongoDB, Firebase, MinIO)',
            'Code review across every PR',
            'Roadmap and milestone planning',
            'Team mentorship',
        ],
        publishedAt: new Date('2025-12-08T00:00:00Z'),
        featured: false,
        metaTitle: 'Moon Support Hub — Enterprise ticketing on Next.js 16 + Prisma + MongoDB',
        metaDescription:
            'Moon Support Hub is an enterprise ticketing platform built on Next.js 16 with Prisma on MongoDB. 135+ API endpoints, 60 models, 14 scheduled background jobs, 8-role RBAC, SLA management, and a knowledge base with publishing workflow.',
        seoKeywords: ['moon support hub', 'enterprise ticketing', 'support platform', 'nextjs 16 enterprise', 'prisma mongodb', 'rbac 8 roles', 'sla management', 'knowledge base', 'minio s3', 'firebase oauth', 'background jobs', 'sse notifications', 'ticket management system'],
        about: ['Next.js', 'Prisma', 'MongoDB', 'Firebase Authentication', 'MinIO', 'Role-based access control', 'Enterprise software'],
        mentions: ['SSE', 'Recharts', 'Mermaid', 'KaTeX', 'Monaco Editor', 'Mammoth', 'Mailpit', 'OAuth', 'TypeScript', 'Docker Compose'],
    },
    {
        slug: 'live-deck-call-center-dashboard',
        title: 'Live Deck: a call center dashboard for the TV wall',
        subtitle: 'React 19 + Vite 7 + React Server Components, version 2.0.1, 9 widgets, 32×18 draggable grid, SSE streaming with zombie-connection detection',
        excerpt:
            'Live Deck is the wall-mounted dashboard the Moon Holidays call center watches all day. Version 2.0.1. React Server Components, Vite 7, TanStack Query v5, nine widgets in a draggable 32×18 grid, real-time Aircall WebSocket streaming, SSE with zombie-connection detection, optional single-use ticket auth, and a hardened security model for unattended kiosk operation.',
        content: `## Overview

Live Deck is the wall-mounted dashboard the Moon Holidays call center watches all day. Version **2.0.1** as of now. It consumes live data from the [Travel Panel core platform](/portfolio/travel-panel-core-platform) and from Aircall telephony, rendered through React Server Components serving a landing grid with Sales, Customer Service, and Marketing tiles — the Customer Service dashboard is the fully built one, with nine widgets streaming live data; the other two are reserved placeholders for future expansion.

It has to look crisp at 55 inches, never drop a frame, and never stop running.

## The real problem

Off-the-shelf BI dashboards are built for desks, not for TVs. They assume someone is clicking around. A call center TV has to be glanceable, high-contrast, updated in real time, and ideally unattended for weeks. That last requirement turns out to be the hard one: the dashboard has to survive network blips, zombie SSE connections, tab suspension, and browser refresh loops without anyone walking into the room to fix it.

## What got built

- **Draggable 32×18 grid layouts** for widget placement. Operators drag widgets into position once, save the profile, and forget. Layout migration handles changes between versions without losing user configurations.
- **Multi-profile settings** per user, so different shift leaders can have different layouts.
- **Real-time WebSocket streaming** of Aircall call data (\`VITE_WSS_URL\`), combined with historical data loaded on mount via TanStack Query.
- **SSE push for server-initiated updates** at \`GET /api/v1/events\`, with **zombie-connection detection** using named \`heartbeat\` events (not \`:ping\` comments) at a 30-second interval so the client stall detector can surface connection death to the reconnect logic.
- **TV and kiosk optimization**: spatial navigation (D-pad friendly), auto-rotation, branded landing page with live server status indicators, \`VITE_ENABLE_SETTINGS_UI=false\` for kiosk mode to hide editing controls.
- **Per-widget configuration**, each card tuned independently.
- **Content-aware RTL** because the dashboard runs in offices that work in both Hebrew and English.
- **Demo mode** without Firebase — set any credentials and the app boots to show the landing grid, useful for on-site demos without the production identity provider.

## Tech stack

React 19, TypeScript, Vite 7 with React Server Components (entry.rsc.tsx → entry.ssr.tsx → entry.browser.tsx pipeline). TanStack Query v5 for server state. Context API for Auth, Data, SSE, Theme, Settings, and Permissions. Zod for runtime validation. MUI theme (dark/light, presets). Firebase OAuth with optional domain allowlist for access control.

**Settings backend**: a custom HTTP server on port 3001 writing to SQLite. Three \`DB_MODE\` variants — \`local\` (\`./server/data/settings.db\`), \`docker\` (\`/data/settings.db\`), and \`prod\` (\`/data/prod/settings.db\`). Bind-mount from local disk or block storage only — no NFS/CIFS (WAL corruption guaranteed).

**Proxy architecture**: all external API calls are proxied through the server. \`DATA_FETCH_URL\` and \`DATA_FETCH_AUTH\` stay on the server. The client holds only a short-lived Firebase JWT that rotates automatically. API credentials never reach the browser.

## SSE endpoint hardening

The SSE route is the only endpoint that cannot accept a \`Bearer\` header because the browser \`EventSource\` API does not allow custom headers. I did not want to leave it unprotected, so I designed **six layers of defense**:

1. **No identifiers on the wire.** Broadcast payloads are pure invalidation signals — \`{}\` for every event type. Firebase UIDs used to flow through \`settings:changed\` / \`viewTransition:changed\` payloads; they are now stripped by \`eventPublisher.ts\` before publish.
2. **Origin allow-list.** Browsers sending an \`Origin\` header must match \`CORS_ORIGIN\` or get 403 before a connection slot is consumed.
3. **Strict response CSP.** \`default-src 'none'; frame-ancestors 'none'\` plus \`X-Content-Type-Options: nosniff\`.
4. **Connection limits**: per-IP (\`SSE_MAX_CONNECTIONS_PER_IP\`, default 10) and global (\`SSE_MAX_CONNECTIONS_TOTAL\`, default 1000) with a throttled warn log at 80% of the global cap so ops can react before the 503 cliff.
5. **Optional single-use ticket auth** (off by default). When \`SSE_REQUIRE_TICKET=true\`, clients must first \`POST /api/v1/events/ticket\` with a Firebase JWT to obtain a 30-second single-use ticket, then open the EventSource with \`?ticket=<id>\`. Reconnect requires a fresh ticket.
6. **Rate limiter**: the global 100 req/min per-IP rate limiter applies to this route, so reconnect storms from a single IP are bounded.

## Performance tuning

- **WebSocket batch window** of 50ms for non-critical events — bundling multiple updates into a single render pass. **Critical events** (\`snapshot\`, \`call.*\`, \`user.*\`) bypass the timer and flush on the next microtask.
- **SSE jitter** up to 2000ms to mitigate thundering-herd reconnects.
- **Optional L1 cache trust window** (\`PERF_CACHE_TRUST_TTL_S\`) to reduce database lookups during high-frequency settings reads.
- **Optional UNION ALL query batching** to collapse 46+ settings queries into ~12.
- **Optional connection-age recycling** (\`SSE_MAX_CONNECTION_AGE_MS\`) that force-closes connections after a configurable age and lets the client auto-reconnect with \`Last-Event-ID\` replay. Recommended production value for long-lived kiosk deployments: 1 hour.

## Permissions

Single permission key \`liveDeck\` with three flags: \`Read\`, \`Edit\`, \`Remove\`. Server enforces via \`requirePermission()\` middleware on every route. Default-deny on any failure. Client hides UI elements the user cannot use.

## Docker

- **Production**: 2-stage Docker build. Stage 1 builds the Vite client bundle with \`VITE_*\` env vars baked in. Stage 2 runs Node serving API + SSE + RSC-rendered frontend on a single port. **No \`.env\` in the final image.** JWT verification uses Firebase public JWKS, not a service account key.
- **Development**: no build step. Source code bind-mounted, Vite HMR + tsx watch, node_modules as a named volume to avoid host/container platform mismatch.
- **Health checks**: \`/api/v1/health\` and \`/api/v1/health/ready\` (with database readiness). Docker health check runs every 30 seconds.

## What [I](/) learned

Dashboards displayed on TVs are fundamentally different from dashboards used on desktops. Every assumption about user interaction is wrong. The important questions are "does it survive overnight", "does it degrade gracefully when data stops arriving", and "does a random network blip require someone to walk into the call center and click refresh". The answer to the last one has to be no.

I ended up writing more reconnection, zombie-detection, and SSE-hardening code than actual chart code. That is normal for unattended production systems, and it is exactly the boring work that decides whether the thing stays running through the night.

**License**: Proprietary, Moon Holidays Co., Ltd. All rights reserved.`,
        tags: ['react', 'typescript', 'vite', 'rsc', 'websocket', 'sse', 'dashboard', 'tanstack-query', 'sqlite'],
        category: 'Case Study',
        thumbnailFile: 'live-deck.svg',
        clientName: 'Moon Holidays',
        clientUrl: 'https://moonholidays.co.th',
        engagementPeriod: 'Jan 2026 — Present',
        role: 'Head of Development & IT Infrastructure',
        deliverables: [
            'Draggable 32×18 widget grid',
            'Real-time WebSocket + SSE data streaming',
            'Zombie-connection detection and auto-reconnect',
            'TV / kiosk optimized UI',
            'Multi-profile settings',
        ],
        publishedAt: new Date('2026-01-13T00:00:00Z'),
        featured: false,
        metaTitle: 'Live Deck — React 19 + Vite 7 RSC dashboard for call center TVs',
        metaDescription:
            'Live Deck is a React 19 + Vite 7 + React Server Components dashboard for unattended TV operation. Draggable 32x18 grid, SSE streaming with zombie-connection detection, Aircall WebSocket feeds, and six layers of SSE endpoint hardening.',
        seoKeywords: ['live deck', 'react 19 dashboard', 'vite 7 rsc', 'react server components', 'tanstack query', 'sse stream', 'websocket aircall', 'tv kiosk dashboard', 'call center analytics', 'firebase jwks', 'zombie connection detection', 'draggable grid layout'],
        about: ['React', 'Vite', 'React Server Components', 'Server-Sent Events', 'WebSocket', 'Real-time dashboards'],
        mentions: ['TanStack Query', 'Firebase Auth', 'SQLite', 'Aircall', 'Docker', 'Origin allow-list', 'CSP', 'Ticket authentication'],
    },
    {
        slug: 'vercel-controller-async-ops-proxy',
        title: 'Vercel Controller: a Node.js microservice for Vercel cache and deployments',
        subtitle: 'Express 4 service with async job queue, smart deduplication, LRU cache, Helmet.js security, and 129 tests — called by Travel Panel whenever content changes',
        excerpt:
            'Vercel Controller wraps the Vercel API behind a stable interface for every service in the Moon Holidays platform. Express 4 + Helmet.js, async job queue with smart deduplication, LRU response cache with 88% hit rate, bearer token auth with timing-safe comparison, 129 tests, and auto-healing Docker. Travel Panel calls it whenever content changes to invalidate CloudFront and redeploy dependent frontends.',
        content: `## Overview

Vercel Controller is a Node.js microservice (Express 4) that wraps the Vercel API behind a stable interface. It is called by the [Travel Panel core platform](/portfolio/travel-panel-core-platform) whenever content changes: a new offer published, a hotel updated, an inventory adjustment, or a brand-level config change. The controller takes that signal, purges CloudFront cache for the affected paths, triggers a redeploy of the dependent Vercel frontends, and reports status back through an async job API.

It exists because operating a production front-end on Vercel at scale eventually means you need more than the Vercel dashboard. You need to trigger cache purges and deploys from CI, from webhooks, from operators, and from other services in the platform. You need to do it without tripping Vercel's rate limits or duplicating work. And you need to know whether the operation actually landed.

## What it solves

**Manual Vercel operations.** Click, wait, click again. Bad for ops, invisible to automation.

**Rate limit pain.** Vercel imposes a **60-second interval on purge operations**. Naive scripts that fire off multiple purges in a row fail silently or get throttled. The controller serializes operations behind a queue that respects the interval.

**Duplicate jobs.** If two systems trigger a cache purge for the same project within the same minute, you waste one call and risk inconsistency. Smart deduplication detects an in-flight job for the same project + operation key and attaches new requests to it instead of queuing a duplicate.

**Visibility.** Knowing whether an async operation finished and whether it succeeded requires polling, and polling requires a stable interface.

## API endpoints

| Method | Endpoint | Description |
|---|---|---|
| GET | \`/health\` | Health check with full stats (no auth) |
| GET | \`/projects\` | List all team projects (cached) |
| POST | \`/purge/{project}\` | Purge cache (async by default) |
| POST | \`/purge-all\` | Purge cache for all projects |
| POST | \`/redeploy/{project}\` | Redeploy a project (async by default) |
| GET | \`/jobs\` | List recent jobs |
| GET | \`/jobs/{jobId}\` | Get job status / result |

Three purge types supported: **all cache**, **data cache only**, or **CDN only**. Redeploys target **production** or **preview** by default.

## Health check output

The health endpoint returns everything an operator or monitoring system needs:

\`\`\`json
{
  "status": "ok",
  "service": "vercel-controller",
  "version": "1.3.5",
  "uptime": 3600,
  "memory": {"used": "45MB", "total": "128MB"},
  "config": {
    "team": "moon-holidays",
    "auth": "enabled",
    "swagger": "/docs",
    "rateLimit": "100 req/60s"
  },
  "cache": {
    "size": 5,
    "hits": 150,
    "misses": 20,
    "hitRate": "88%"
  },
  "queue": {
    "pending": 2,
    "processing": 1,
    "completed": 45,
    "failed": 0
  }
}
\`\`\`

## Security model

Every endpoint except \`/health\` and \`/docs\` requires Bearer token authentication. The token comparison is **timing-safe** to prevent side-channel leakage. Beyond auth:

- **Helmet.js 7** for security headers (CSP, HSTS, X-Frame-Options, X-Content-Type-Options, Referrer-Policy)
- **express-rate-limit 7** with configurable per-IP limits (default: 100 req/min)
- **CORS** with explicit allowed-origin list
- **Strict input validation** on every parameter (project ID, purge type, deploy target, IDs)
- **Request size limits** of 10 KB max JSON payload to prevent oversize DoS
- **Startup validation**: the service fails fast if \`VERCEL_TOKEN\`, \`VERCEL_TEAM_SLUG\`, or \`VERCEL_ORG_ID\` are missing — no running without credentials
- **Graceful shutdown** on SIGTERM/SIGINT so in-flight requests complete and no queued jobs get stranded
- **Type confusion prevention** in the validation layer

## Testing

**129 tests** in total, organized by concern:

- Validation functions (projectId, purge type, deploy target, secure compare)
- API endpoints (health, auth, purge, redeploy, jobs, cache)
- Queue service (enqueueing, deduplication, smart keys, stats)
- Cache service (TTL expiration, LRU eviction, stats)
- Job rate limiter (client isolation, window reset)
- CORS wildcard support
- Security (headers, error handling, type confusion prevention)

The jest config enforces 50% minimum coverage on branches, functions, lines, and statements as a floor, with the actual numbers higher across the critical modules.

## Docker + auto-healing

Two docker-compose configurations:

| Feature | \`docker-compose.yml\` | \`docker-compose.dev.yml\` |
|---|---|---|
| Swagger UI | disabled | \`/docs\` |
| Autoheal | enabled | disabled |
| Image size | lighter | larger (swagger-ui-express) |
| Restart policy | always | unless-stopped |

**Production includes autoheal**: a sidecar monitors container health every 30 seconds and automatically restarts unhealthy containers. Zero-touch recovery for the common failure modes.

## How Travel Panel uses it

When a Travel Panel operator publishes a new offer, updates a hotel listing, or adjusts inventory, the FastAPI backend makes an authenticated POST to Vercel Controller. Vercel Controller enqueues a purge + redeploy job for the affected frontend projects (TravelOffer, B2B portal, operator portal if its static bundle needs a refresh), deduplicates against any in-flight job, and returns a job ID immediately.

Travel Panel does not wait. The background job flushes CloudFront and triggers the Vercel deploys on its own cadence, respecting the 60-second purge interval and never doubling up work. Operators see a banner when a cache refresh is in progress and another when it lands.

This is the quietest piece of infrastructure in the whole Moon Holidays stack. You do not notice it unless it is missing.

## Tech stack

Node.js, Express 4.18, Helmet.js 7, express-rate-limit 7, CORS, Swagger UI Express (dev only), in-memory LRU cache, in-memory job queue, Jest 29 with Supertest, Docker, Docker Compose with autoheal sidecar.

**Version**: 1.3.5.
**Port**: 3500.
**License**: Proprietary — Copyright © 2026 George Khananaev. All rights reserved.

## Takeaway

Wrapping a third-party API behind a service you own pays off the moment you need to add deduplication, rate limiting, or observability. Vercel Controller started as a small script and grew into the right place to solve every Vercel-operations problem for the whole platform. Small, focused services like this are [my](/) favorite kind of infrastructure: they are easy to reason about, easy to replace, and they earn their keep every time someone skips a manual click.

For other small, focused utilities I've open-sourced, see [py-image-compressor](/portfolio/py-image-compressor) (batch image optimization CLI) and [FastAPI DocShield](/portfolio/fastapi-docshield) (HTTP Basic auth for docs endpoints). Same philosophy, different problems.`,
        tags: ['nodejs', 'express', 'vercel', 'devops', 'async', 'rate-limiting', 'security', 'microservice'],
        category: 'Technical Deep-Dive',
        thumbnailFile: 'vercel-controller.svg',
        clientName: 'Moon Holidays',
        clientUrl: 'https://moonholidays.co.th',
        engagementPeriod: 'Jan 2026',
        role: 'Head of Development & IT Infrastructure',
        deliverables: [
            'REST API wrapping Vercel cache + deploys',
            'Async job queue with deduplication',
            'LRU response cache',
            'Rate limit protection (60s purge interval)',
            'Bearer token auth with timing-safe compare',
        ],
        publishedAt: new Date('2026-01-18T00:00:00Z'),
        featured: false,
        metaTitle: 'Vercel Controller — Node.js + Express microservice for Vercel cache and deploys',
        metaDescription:
            'Express 4 microservice that wraps the Vercel API with async job queues, smart deduplication, LRU response cache, Helmet.js security, timing-safe bearer auth, and 129 tests. Called by Travel Panel for cache invalidation.',
        seoKeywords: ['vercel controller', 'vercel api wrapper', 'nodejs express microservice', 'async job queue', 'lru cache', 'helmet.js', 'rate limiting express', 'cdn cache purge', 'timing-safe auth', 'cloudfront invalidation', 'autohealing docker'],
        about: ['Vercel', 'Node.js', 'Express', 'Microservices', 'REST API design', 'Rate limiting'],
        mentions: ['Helmet.js', 'express-rate-limit', 'Swagger UI', 'Jest', 'Supertest', 'Docker Compose', 'Autoheal', 'LRU cache', 'Bearer token'],
    },
    {
        slug: 'staysync-b2b-hotel-allotment',
        title: 'StaySync: B2B hotel allotment management',
        subtitle: 'NestJS 11 + Drizzle + PostgreSQL 17 platform with 12 modules, 532 tests (99.63% allotment coverage), and a Contracts → Resolver → PoolBudget pipeline',
        excerpt:
            'StaySync is the B2B hotel allotment platform: allotment calendars, hardblocks with amendment history, booking orders, advisory-locked availability checks, and real-time sync with the Moon Holidays supplier API. Built on NestJS 11 with Drizzle ORM, PostgreSQL 17, Firebase auth, 12 business modules, 17 test suites, 532 tests, and two Next.js frontends consuming the API.',
        content: `## Overview

StaySync is the B2B hotel allotment platform, built as a standalone service that integrates with the [Travel Panel core platform](/portfolio/travel-panel-core-platform) for inventory and availability. Room blocks (hardblocks), booking orders, allotment calendars, and real-time sync with the upstream Moon Holidays supplier API. This is the software that keeps hotel inventory accurate across dozens of partners and prevents the nightmare scenario of selling a room that has already been allocated elsewhere.

## The problem

Hotel allotment management sounds simple. You have N rooms, you allocate them across M partners, you track what is sold versus what is available. The complexity is everywhere around those basics:

- **Bookings expire** after a configurable window (default 15 minutes in \`BOOKING_EXPIRY_MINUTES\`). Expired bookings return their inventory to the pool, but only if no downstream confirmation has landed in the meantime.
- **Hardblocks** reserve inventory with different rules from sold bookings. They can be amended, released, or partially returned.
- **Upstream suppliers** return different room counts at different times. Reconciliation has to absorb noise without corrupting the local view.
- **Partners** each want their own scoped view of inventory. Role-scoped APIs are not a bolt-on; they are the primary access model.
- **Every number** has to reconcile against the single source of truth at the hotel supplier API.

## Architecture

### Core business modules

\`\`\`
src/modules/
├── agency/               # Travel agency management
├── allotment/            # Calendar resolution pipeline
├── allotment-core/       # Shared allotment logic (breaks circular deps)
├── allotment-event/      # Allotment event CRUD
├── reservation/          # Bookings + sale orders
├── hardblock/            # Room block lifecycle
├── external-data/        # MHG API sync / ETL
├── webhook/              # External event webhooks
├── contract-search/      # Contract text search
├── sse/                  # Server-Sent Events
├── auth/                 # Firebase auth guard (global)
└── health/               # Health probe
\`\`\`

### The allotment resolution pipeline

Allotment calendars are not stored as flat numbers. They are **resolved** on demand through a pipeline:

\`\`\`
Contracts → Resolver → EventApplier → PoolBudget → per-day availability
\`\`\`

Each contract from the upstream supplier feeds the resolver, which applies every allotment event on top (INCREASE_ALLOTMENT, REDUCE_ALLOTMENT, BLOCK_CONTRACT, BLOCK_AMENDMENT, RATE_CHANGE), then runs the PoolBudget calculation to produce per-day availability for each room type. The output is consistent regardless of how the data was loaded or in what order the events arrived.

### Hardblock module

Hardblocks are the most feature-dense module. The operations it exposes:

- Create / amend / release
- Auto-release scheduling
- Slot-level inventory grid
- Bulk operations (bulk release, bulk extend)
- Amendment preview state, amendment diff grid, partial amendment overlay
- Revert amendment
- Inventory for date ranges
- Reserve rooms from block
- Release day inventory
- Cell detail with bookings and pricing

Every write touches the audit log, so there is always a trail back to who did what when.

### Reservation module

Composite: \`BookingService\`, \`SaleOrderService\`, \`AllotmentAvailabilityService\`. The critical path is \`POST /bookings\`, which does an **availability check inside an advisory lock**. Without the lock, two partners clicking "Book" at the same millisecond would both succeed and the overbooking would only be caught later. The advisory lock serializes the critical section at the Postgres level so only one booking for the same resource can progress at a time.

Confirming a booking promotes it to a sale order through \`PATCH /bookings/:groupId/confirm\`. Cancelling releases the inventory back to the pool. The whole lifecycle is audited.

## Database

PostgreSQL 17 via Docker. Schema managed with **drizzle-kit push** (no migration files), so schema changes are declarative and checked into git. Tables:

- \`agencies\`
- \`allotment_events\`
- \`bookings\` + \`booking_audit_log\`
- \`sale_orders\`
- \`hard_block_meta\`
- \`status_transform_configs\`
- \`sync_runs\`

All repositories extend a shared **\`BaseRepository\`** for consistent query patterns, pagination DTOs, and transaction handling via a dedicated \`TransactionService\`.

## Testing

**17 test suites. 532 tests. All passing.**

| Module | Statement coverage | Tests |
|---|---|---|
| allotment | 99.63% | 6 suites (224 tests) |
| reservation | 72.24% | 5 suites |
| allotment-event | 57.89% | 2 suites |
| hardblock | 43.73% | 3 suites |
| external-data | 14.74% | 1 suite |

Jest 30 with @swc/jest for fast TypeScript compilation. Tests co-located with source files as \`*.spec.ts\`. The allotment module — the most complex one, with the resolver pipeline — sits at 99.63% coverage because the business logic is non-negotiable: a bug in the pipeline produces wrong availability, and wrong availability loses money.

## Frontends

Two consumers of the API, each a Next.js 16 app on React 19 with Tailwind CSS 4 and App Router:

- \`stay-sync-frontend\` — the operator portal on port 4000
- \`stay-sync-task-frontend\` — the agent-facing task app on port 4500

Both authenticate with Firebase. Both use the Swagger documentation at \`/api/docs\` as the contract surface.

## External data sync

The \`external-data\` module is the ETL layer that syncs with the upstream MHG hotel supplier API (\`office-fastapi-dev1.mhgthailand.com/api/v1\`). It supports manual trigger via \`POST /sync\` and auto-sync via a file watcher that re-runs when source data changes. Webhook endpoints accept contract and event updates from external systems so updates arrive push-style instead of being polled.

## Tech stack

NestJS 11, TypeScript, Drizzle ORM, PostgreSQL 17, Firebase Admin SDK (JWT auth), Jest 30 with @swc/jest, Zod, Swagger, Docker.

API prefix: \`/api/v1\`. Server runs on port 3001.

## Takeaway

When integrating with an external system of record, build defensively. The upstream API will return unexpected shapes, drift between environments, and occasionally return the same room count in two different units. **Validate everything at the wall and trust nothing past it.**

The allotment module sits at 99.63% test coverage because the business logic is non-negotiable: a bug in the pipeline produces wrong availability, and wrong availability loses money. Invest the testing effort where the stakes are highest and let the less critical modules catch up later.

For a simpler full-stack reference project [I](/) maintain publicly (typed backend, auth, RBAC, Swagger-documented API), see [PyNextStack](/portfolio/pynextstack).`,
        tags: ['nestjs', 'typescript', 'postgresql', 'drizzle', 'firebase', 'b2b', 'architecture', 'zod'],
        category: 'Case Study',
        thumbnailFile: 'stay-sync.svg',
        clientName: 'Moon Holidays',
        clientUrl: 'https://moonholidays.co.th',
        engagementPeriod: 'Feb 2026 — Present',
        role: 'Head of Development & IT Infrastructure',
        deliverables: [
            'NestJS backend with Drizzle + Postgres',
            'Allotment and hardblock management',
            'Real-time supplier API sync',
            'Zod validation at every external boundary',
            'Role-scoped partner APIs',
        ],
        publishedAt: new Date('2026-02-17T00:00:00Z'),
        featured: false,
        metaTitle: 'StaySync — NestJS + Drizzle + PostgreSQL B2B hotel allotment platform',
        metaDescription:
            'StaySync is a B2B hotel allotment platform on NestJS 11 + Drizzle ORM + PostgreSQL 17. 12 business modules, advisory-locked booking creation, Contracts→Resolver→PoolBudget pipeline, 532 tests, 99.63% allotment coverage.',
        seoKeywords: ['staysync', 'nestjs 11', 'drizzle orm', 'postgresql 17', 'hotel allotment system', 'b2b hotel platform', 'room block management', 'hardblock', 'advisory lock booking', 'firebase admin sdk', 'swagger api', 'zod validation'],
        about: ['NestJS', 'PostgreSQL', 'Drizzle ORM', 'TypeScript', 'Hotel allotment management', 'B2B platforms'],
        mentions: ['Firebase Admin SDK', 'Jest', 'Zod', 'Swagger UI', 'Advisory locks', 'ETL', 'Server-Sent Events', 'Docker'],
    },
];


// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function countWords(markdown) {
    const stripped = markdown
        .replace(/```[\s\S]*?```/g, '')
        .replace(/`[^`]*`/g, '')
        .replace(/!\[.*?\]\(.*?\)/g, '')
        .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
        .replace(/<[^>]+>/g, '')
        .replace(/[#>*_~\-=]/g, ' ')
        .trim();
    if (!stripped) return 0;
    return stripped.split(/\s+/).length;
}

function readingTimeMinutes(words) {
    return Math.max(1, Math.ceil(words / 200));
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

async function main() {
    console.log('\n▶ Seeding portfolio posts\n');

    const copied = copyPortfolioImages();
    console.log(`  ✓ Copied ${copied} portfolio SVGs to public/portfolio/`);

    const client = new MongoClient(MONGODB_URI, {
        maxPoolSize: 5,
        serverSelectionTimeoutMS: 10_000,
    });

    try {
        await client.connect();
        console.log('  ✓ Connected to MongoDB Atlas');

        const db = client.db(MONGODB_DB);
        const collection = db.collection(POSTS_COLLECTION);

        // Ensure indexes (idempotent)
        await collection.createIndex({slug: 1}, {unique: true});
        await collection.createIndex({status: 1, publishedAt: -1});
        await collection.createIndex({tags: 1, publishedAt: -1});
        await collection.createIndex({featured: 1, publishedAt: -1});
        await collection.createIndex({updatedAt: -1});
        console.log('  ✓ Indexes ensured');

        // Cleanup: delete any commercial posts that are no longer in the seed list.
        // (Public posts are left alone; users may keep historical imports.)
        const currentCommercialSlugs = commercialSeeds.map(s => s.slug);
        const deleteResult = await collection.deleteMany({
            portfolioType: 'commercial',
            slug: {$nin: currentCommercialSlugs},
        });
        if (deleteResult.deletedCount > 0) {
            console.log(`  ✗ Deleted ${deleteResult.deletedCount} stale commercial posts`);
        }

        let inserted = 0;
        let updated = 0;

        // Batch-fetch GitHub created_at for every public seed post up front.
        console.log('  ⟳ Fetching GitHub created_at dates...');
        const createdDates = await Promise.all(seedPosts.map(s => fetchGithubCreatedAt(s.githubUrl)));

        console.log('\n  === Public portfolio ===');
        for (let i = 0; i < seedPosts.length; i++) {
            const seed = seedPosts[i];
            const wordCount = countWords(seed.content);
            const readingTime = readingTimeMinutes(wordCount);

            // publishedAt + updatedAt both come from repo created_at.
            // Falls back to daysAgo() if the GitHub fetch failed.
            const createdAtFromGithub = createdDates[i];
            const publishedAt = createdAtFromGithub ?? daysAgo(seed.daysAgo);
            const updatedAt = publishedAt;
            const dateSource = createdAtFromGithub ? 'github created_at' : 'fallback (daysAgo)';

            const thumbnailUrl = `/portfolio/${seed.thumbnailFile}`;

            const doc = {
                slug: seed.slug,
                title: seed.title,
                subtitle: seed.subtitle,
                excerpt: seed.excerpt,
                content: seed.content,
                contentType: 'markdown',
                portfolioType: 'public',
                seo: {
                    metaTitle: seed.metaTitle,
                    metaDescription: seed.metaDescription,
                    keywords: seed.seoKeywords ?? seed.tags,
                },
                thumbnail: {
                    url: thumbnailUrl,
                    alt: `${seed.title} illustration`,
                    width: 400,
                    height: 400,
                },
                tags: seed.tags,
                category: seed.category,
                author: AUTHOR,
                publishedAt,
                updatedAt,
                readingTime,
                wordCount,
                status: 'published',
                featured: seed.featured,
                githubUrl: seed.githubUrl,
                jsonLd: {
                    type: 'TechArticle',
                    about: seed.about ?? seed.tags.slice(0, 3),
                    mentions: seed.mentions,
                },
            };

            const result = await collection.updateOne(
                {slug: seed.slug},
                {$set: doc, $setOnInsert: {createdAt: publishedAt}},
                {upsert: true},
            );

            const datePretty = publishedAt.toISOString().slice(0, 10);
            if (result.upsertedCount) {
                inserted++;
                console.log(`  ✓ Inserted: ${seed.slug}  (${datePretty} via ${dateSource})`);
            } else if (result.modifiedCount) {
                updated++;
                console.log(`  ↻ Updated:  ${seed.slug}  (${datePretty} via ${dateSource})`);
            } else {
                console.log(`  = Unchanged: ${seed.slug}  (${datePretty} via ${dateSource})`);
            }
        }

        console.log('\n  === Commercial portfolio ===');
        for (const seed of commercialSeeds) {
            const wordCount = countWords(seed.content);
            const readingTime = readingTimeMinutes(wordCount);
            const publishedAt = seed.publishedAt;
            const updatedAt = publishedAt;

            const thumbnailUrl = `/portfolio/${seed.thumbnailFile}`;

            const doc = {
                slug: seed.slug,
                title: seed.title,
                subtitle: seed.subtitle,
                excerpt: seed.excerpt,
                content: seed.content,
                contentType: 'markdown',
                portfolioType: 'commercial',
                seo: {
                    metaTitle: seed.metaTitle,
                    metaDescription: seed.metaDescription,
                    keywords: seed.seoKeywords ?? seed.tags,
                },
                thumbnail: {
                    url: thumbnailUrl,
                    alt: `${seed.title} illustration`,
                    width: 400,
                    height: 400,
                },
                tags: seed.tags,
                category: seed.category,
                author: AUTHOR,
                publishedAt,
                updatedAt,
                readingTime,
                wordCount,
                status: 'published',
                featured: seed.featured,
                clientName: seed.clientName,
                clientUrl: seed.clientUrl,
                engagementPeriod: seed.engagementPeriod,
                role: seed.role,
                deliverables: seed.deliverables,
                jsonLd: {
                    type: 'Article',
                    about: seed.about ?? seed.tags.slice(0, 3),
                    mentions: seed.mentions,
                },
            };

            const result = await collection.updateOne(
                {slug: seed.slug},
                {$set: doc, $setOnInsert: {createdAt: publishedAt}},
                {upsert: true},
            );

            const datePretty = publishedAt.toISOString().slice(0, 10);
            const clientLabel = seed.clientName ?? 'Confidential client';
            if (result.upsertedCount) {
                inserted++;
                console.log(`  ✓ Inserted: ${seed.slug}  (${datePretty}, ${clientLabel})`);
            } else if (result.modifiedCount) {
                updated++;
                console.log(`  ↻ Updated:  ${seed.slug}  (${datePretty}, ${clientLabel})`);
            } else {
                console.log(`  = Unchanged: ${seed.slug}  (${datePretty}, ${clientLabel})`);
            }
        }

        const total = await collection.countDocuments({status: 'published'});
        console.log(`\n✓ Done. Inserted ${inserted}, updated ${updated}. Total published posts: ${total}\n`);
    } catch (err) {
        console.error('\n✗ Seed failed:', err);
        process.exitCode = 1;
    } finally {
        await client.close();
    }
}

main();
