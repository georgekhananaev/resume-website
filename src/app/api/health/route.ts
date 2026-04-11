import {NextResponse} from 'next/server';

import {getDb} from '../../../lib/db';
import {APP_NAME, APP_VERSION} from '../../../lib/version';

/**
 * Health-check endpoint with real dependency probes — public-safe response.
 *
 * Probes performed on every request (internally — results NOT exposed):
 *   1. MongoDB connectivity — runs `db.command({ping: 1})`, the standard
 *      lightweight liveness probe recommended by Atlas. Round-trip is a
 *      single network hop, no collection scans, no auth renegotiation.
 *   2. Required environment variables — checks which `process.env` keys
 *      the app needs are set.
 *
 * The response body is **deliberately minimal** — just `status`, `name`,
 * `version`, `timestamp`. This endpoint is public, so we must not leak:
 *   - MongoDB latency (reveals infra timing and region)
 *   - Missing env var names (reveals deployment state and attack surface)
 *   - Error strings (reveals MongoDB driver version, stack traces)
 *
 * The aggregate status still reflects real health:
 *   status: "ok"    — everything passed
 *   status: "error" — at least one critical check failed
 *
 * HTTP status mirrors the aggregate:
 *   200 → healthy (uptime monitors treat as up)
 *   503 → critical dependency down (uptime monitors page on this)
 *
 * Cache: public 30s. Short enough that post-deploy checks see fresh
 * status quickly, long enough that a 5s-polling monitor doesn't DoS
 * MongoDB with 12 ping calls per minute.
 */

// Required env vars — if any are missing the app is effectively broken.
// Order matters: listed most-critical-first so humans eyeballing the
// `missing` array can spot the blocker faster.
const REQUIRED_ENV = [
    'MONGODB_URI',
    'RECAPTCHA_SECRET_KEY',
    'NEXT_PUBLIC_RECAPTCHA_SITE_KEY',
    'EMAILJS_SERVICE_ID',
    'EMAILJS_TEMPLATE_ID',
    'EMAILJS_PUBLIC_KEY',
    'EMAILJS_PRIVATE_KEY',
    'EMAILJS_TO_EMAIL',
    'GITHUB_USERNAME',
] as const;

const MONGO_PING_TIMEOUT_MS = 3000;

// Next.js runtime hints — MongoDB driver is Node-only (not Edge-compatible),
// and every request should re-run the checks rather than serve a stale
// Next data-cache entry.
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

type CheckStatus = 'ok' | 'degraded' | 'error';

interface MongoCheck {
    status: CheckStatus;
    latency_ms: number;
    error?: string;
}

interface EnvCheck {
    status: CheckStatus;
    missing: string[];
}

async function checkMongo(): Promise<MongoCheck> {
    const start = Date.now();
    try {
        // Race the ping against a hard timeout so a hung Mongo connection
        // can't stall the health endpoint longer than MONGO_PING_TIMEOUT_MS.
        const result = await Promise.race([
            getDb().then(db => db.command({ping: 1})),
            new Promise<never>((_, reject) =>
                setTimeout(
                    () => reject(new Error(`mongodb ping timeout after ${MONGO_PING_TIMEOUT_MS}ms`)),
                    MONGO_PING_TIMEOUT_MS,
                ),
            ),
        ]);
        const latency_ms = Date.now() - start;

        if (result && typeof result === 'object' && (result as {ok?: number}).ok === 1) {
            return {status: 'ok', latency_ms};
        }
        return {status: 'error', latency_ms, error: 'unexpected ping response shape'};
    } catch (err) {
        const latency_ms = Date.now() - start;
        // Redact anything in the error message that looks like a connection
        // string ("mongodb+srv://user:pass@host") so no credentials leak.
        const raw = err instanceof Error ? err.message : String(err);
        const error = raw.replace(/mongodb(\+srv)?:\/\/[^\s]+/g, 'mongodb://[redacted]');
        return {status: 'error', latency_ms, error};
    }
}

function checkEnv(): EnvCheck {
    const missing = REQUIRED_ENV.filter(key => !process.env[key]);
    return {
        status: missing.length === 0 ? 'ok' : 'error',
        missing,
    };
}

function aggregateStatus(statuses: CheckStatus[]): CheckStatus {
    if (statuses.includes('error')) return 'error';
    if (statuses.includes('degraded')) return 'degraded';
    return 'ok';
}

export async function GET() {
    const [mongodb, env] = await Promise.all([
        checkMongo(),
        Promise.resolve(checkEnv()),
    ]);

    const status = aggregateStatus([mongodb.status, env.status]);
    const httpCode = status === 'error' ? 503 : 200;

    // Public-safe response: only the aggregate status + identity. The
    // per-check breakdown is intentionally NOT included — it would leak
    // MongoDB latency, exact missing env var names, driver error strings,
    // etc. All three probes still run above, they just inform the HTTP
    // code and the aggregate `status` rather than being echoed back.
    return NextResponse.json(
        {
            status,
            name: APP_NAME,
            version: APP_VERSION,
            timestamp: new Date().toISOString(),
        },
        {
            status: httpCode,
            headers: {
                'Cache-Control': 'public, max-age=30, s-maxage=30',
                'X-Robots-Tag': 'noindex, nofollow, noarchive',
            },
        },
    );
}
