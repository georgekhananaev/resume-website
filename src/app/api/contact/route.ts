import {NextRequest, NextResponse} from 'next/server';

function parseUserAgent(ua: string) {
    let browser = 'Unknown';
    let version = 'Unknown';
    let os = 'Unknown';
    let platform = 'Unknown';

    // OS
    if (ua.includes('Windows NT 10')) { os = 'Windows 10'; platform = 'Windows'; }
    else if (ua.includes('Windows NT 11') || (ua.includes('Windows NT 10') && ua.includes('Windows 11'))) { os = 'Windows 11'; platform = 'Windows'; }
    else if (ua.includes('Windows')) { os = 'Windows'; platform = 'Windows'; }
    else if (ua.includes('Mac OS X')) {
        const match = ua.match(/Mac OS X (\d+[._]\d+[._]?\d*)/);
        os = match ? `macOS ${match[1].replace(/_/g, '.')}` : 'macOS';
        platform = 'macOS';
    }
    else if (ua.includes('iPhone')) { os = 'iOS'; platform = 'iPhone'; }
    else if (ua.includes('iPad')) { os = 'iPadOS'; platform = 'iPad'; }
    else if (ua.includes('Android')) {
        const match = ua.match(/Android (\d+\.?\d*)/);
        os = match ? `Android ${match[1]}` : 'Android';
        platform = 'Android';
    }
    else if (ua.includes('Linux')) { os = 'Linux'; platform = 'Linux'; }

    // Browser
    if (ua.includes('Edg/')) {
        const match = ua.match(/Edg\/([\d.]+)/);
        browser = 'Edge'; version = match?.[1] ?? '';
    } else if (ua.includes('OPR/') || ua.includes('Opera')) {
        const match = ua.match(/OPR\/([\d.]+)/);
        browser = 'Opera'; version = match?.[1] ?? '';
    } else if (ua.includes('Chrome/') && !ua.includes('Edg/')) {
        const match = ua.match(/Chrome\/([\d.]+)/);
        browser = 'Chrome'; version = match?.[1] ?? '';
    } else if (ua.includes('Safari/') && !ua.includes('Chrome')) {
        const match = ua.match(/Version\/([\d.]+)/);
        browser = 'Safari'; version = match?.[1] ?? '';
    } else if (ua.includes('Firefox/')) {
        const match = ua.match(/Firefox\/([\d.]+)/);
        browser = 'Firefox'; version = match?.[1] ?? '';
    }

    return {browser, version, os, platform};
}

const noIndex = {'X-Robots-Tag': 'noindex, nofollow, noarchive'};

// ── Input validation ──────────────────────────────────────────────────────────
// Simple, strict RFC-lite email regex. Good enough to reject object payloads
// and obviously-invalid strings; Google's SMTP will reject the rest.
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

function isString(x: unknown): x is string {
    return typeof x === 'string';
}

// ── In-memory rate limiter ────────────────────────────────────────────────────
// Keyed by client IP. A single node-process window is enough for the realistic
// deployment surface (single-region Vercel/Node deployment) — it's not a
// replacement for Upstash/Redis if this site ever scales horizontally, but
// blocks trivial form-bombing attacks and burns far less EmailJS quota on
// misconfigured probes. 5 requests / minute, 20 / hour per IP.
interface RateWindow {
    minuteCount: number;
    minuteStart: number;
    hourCount: number;
    hourStart: number;
}
const rateMap = new Map<string, RateWindow>();
const MINUTE = 60_000;
const HOUR = 60 * MINUTE;
const MAX_PER_MINUTE = 5;
const MAX_PER_HOUR = 20;

function rateLimit(ip: string): {allowed: boolean; retryAfter?: number} {
    const now = Date.now();
    let win = rateMap.get(ip);
    if (!win) {
        win = {minuteCount: 0, minuteStart: now, hourCount: 0, hourStart: now};
        rateMap.set(ip, win);
    }

    // Roll the minute window
    if (now - win.minuteStart > MINUTE) {
        win.minuteCount = 0;
        win.minuteStart = now;
    }
    // Roll the hour window
    if (now - win.hourStart > HOUR) {
        win.hourCount = 0;
        win.hourStart = now;
    }

    if (win.minuteCount >= MAX_PER_MINUTE) {
        return {allowed: false, retryAfter: Math.ceil((MINUTE - (now - win.minuteStart)) / 1000)};
    }
    if (win.hourCount >= MAX_PER_HOUR) {
        return {allowed: false, retryAfter: Math.ceil((HOUR - (now - win.hourStart)) / 1000)};
    }

    win.minuteCount += 1;
    win.hourCount += 1;

    // Keep the map bounded — if it ever grows past 10k IPs, drop the oldest half.
    if (rateMap.size > 10_000) {
        const entries = Array.from(rateMap.entries()).sort((a, b) => a[1].hourStart - b[1].hourStart);
        for (const [k] of entries.slice(0, 5_000)) rateMap.delete(k);
    }
    return {allowed: true};
}

function getClientIp(request: NextRequest): string {
    const fwd = request.headers.get('x-forwarded-for');
    if (fwd) return fwd.split(',')[0]!.trim();
    return request.headers.get('x-real-ip') || 'unknown';
}

export async function POST(request: NextRequest) {
    // ── Rate limit (applies before any expensive work) ────────────────────────
    const ip = getClientIp(request);
    const limit = rateLimit(ip);
    if (!limit.allowed) {
        return NextResponse.json(
            {error: 'Too many requests. Please try again later.'},
            {status: 429, headers: {...noIndex, 'Retry-After': String(limit.retryAfter ?? 60)}},
        );
    }

    // ── Parse body safely ─────────────────────────────────────────────────────
    let body: Record<string, unknown>;
    try {
        body = await request.json();
    } catch {
        return NextResponse.json({error: 'Invalid JSON body'}, {status: 400, headers: noIndex});
    }

    const from_name = body.from_name;
    const from_email = body.from_email;
    const from_phone = body.from_phone;
    const message = body.message;
    const user_agent = body.user_agent;
    const recaptchaToken = body['g-recaptcha-response'];

    // ── Strict type + shape validation ────────────────────────────────────────
    if (!isString(from_name) || !isString(from_email) || !isString(message)) {
        return NextResponse.json({error: 'Missing or invalid fields'}, {status: 400, headers: noIndex});
    }
    if (from_phone !== undefined && from_phone !== null && !isString(from_phone)) {
        return NextResponse.json({error: 'Invalid phone field'}, {status: 400, headers: noIndex});
    }
    if (user_agent !== undefined && user_agent !== null && !isString(user_agent)) {
        return NextResponse.json({error: 'Invalid user_agent field'}, {status: 400, headers: noIndex});
    }
    if (recaptchaToken !== undefined && recaptchaToken !== null && !isString(recaptchaToken)) {
        return NextResponse.json({error: 'Invalid reCAPTCHA token'}, {status: 400, headers: noIndex});
    }

    // ── Length bounds (both min and max) ──────────────────────────────────────
    if (from_name.trim().length < 2 || from_name.length > 100) {
        return NextResponse.json({error: 'Invalid name length'}, {status: 400, headers: noIndex});
    }
    if (from_email.length < 5 || from_email.length > 200 || !EMAIL_RE.test(from_email)) {
        return NextResponse.json({error: 'Invalid email address'}, {status: 400, headers: noIndex});
    }
    if (message.trim().length < 10 || message.length > 5000) {
        return NextResponse.json({error: 'Invalid message length'}, {status: 400, headers: noIndex});
    }
    if (from_phone && from_phone.length > 20) {
        return NextResponse.json({error: 'Invalid phone number'}, {status: 400, headers: noIndex});
    }

    // ── reCAPTCHA verification ────────────────────────────────────────────────
    // The `NEXT_PUBLIC_DISABLE_RECAPTCHA=true` escape hatch is only honored in
    // non-production environments so a stray production env var can't silently
    // disable bot protection.
    const recaptchaDisabled =
        process.env.NEXT_PUBLIC_DISABLE_RECAPTCHA === 'true' && process.env.NODE_ENV !== 'production';

    if (!recaptchaDisabled) {
        if (!recaptchaToken) {
            return NextResponse.json({error: 'reCAPTCHA verification required'}, {status: 400, headers: noIndex});
        }
        const verifyRes = await fetch('https://www.google.com/recaptcha/api/siteverify', {
            method: 'POST',
            headers: {'Content-Type': 'application/x-www-form-urlencoded'},
            body: new URLSearchParams({
                secret: process.env.RECAPTCHA_SECRET_KEY || '',
                response: recaptchaToken as string,
            }).toString(),
        });

        interface RecaptchaResponse {
            success: boolean;
            score?: number;
            action?: string;
            hostname?: string;
            'error-codes'?: string[];
        }
        const verifyData: RecaptchaResponse = await verifyRes.json();

        // v3 requires score + action; v2 only has `success`. Accept either but
        // enforce score/action when present.
        if (!verifyData.success) {
            return NextResponse.json({error: 'reCAPTCHA verification failed'}, {status: 400, headers: noIndex});
        }
        if (typeof verifyData.score === 'number' && verifyData.score < 0.5) {
            return NextResponse.json({error: 'reCAPTCHA score too low'}, {status: 400, headers: noIndex});
        }
        if (verifyData.action && verifyData.action !== 'contact_form') {
            return NextResponse.json({error: 'reCAPTCHA action mismatch'}, {status: 400, headers: noIndex});
        }
    }

    // ── Parse user agent ──────────────────────────────────────────────────────
    const ua = isString(user_agent) && user_agent ? user_agent : request.headers.get('user-agent') || '';
    const {browser, version, os, platform} = parseUserAgent(ua);
    const referrer = request.headers.get('referer') || 'direct';

    // ── Dispatch via EmailJS ──────────────────────────────────────────────────
    try {
        const response = await fetch('https://api.emailjs.com/api/v1.0/email/send', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                service_id: process.env.EMAILJS_SERVICE_ID,
                template_id: process.env.EMAILJS_TEMPLATE_ID,
                user_id: process.env.EMAILJS_PUBLIC_KEY,
                accessToken: process.env.EMAILJS_PRIVATE_KEY,
                template_params: {
                    title: `New inquiry from ${from_name}`,
                    to_email: process.env.EMAILJS_TO_EMAIL,
                    from_name,
                    from_email,
                    from_phone: from_phone || 'Not provided',
                    message,
                    user_browser: browser,
                    user_version: version,
                    user_os: os,
                    user_platform: platform,
                    user_referrer: referrer,
                    'g-recaptcha-response': recaptchaToken,
                },
            }),
        });

        if (!response.ok) {
            // Log status only — response body may contain PII or token echoes.
            console.error('[contact] EmailJS failed with status', response.status);
            return NextResponse.json({error: 'Failed to send message'}, {status: 500, headers: noIndex});
        }

        return NextResponse.json({text: 'OK'}, {headers: noIndex});
    } catch (error) {
        // Log error class/message only, not the full error which can embed
        // request bodies or env values on some fetch implementations.
        const msg = error instanceof Error ? error.message : 'unknown error';
        console.error('[contact] dispatch error:', msg);
        return NextResponse.json({error: 'Failed to send message'}, {status: 500, headers: noIndex});
    }
}
