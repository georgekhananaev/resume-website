import {type NextRequest,NextResponse} from 'next/server';

import {getPostBySlug, getPublishedPosts} from '../../../lib/posts';

/**
 * Secret-gated GET /api/posts endpoint.
 *
 * Only callable by requests that present the correct shared secret via the
 * `x-internal-secret` header. Intended for internal system use (admin tooling,
 * integration tests, health checks) — NOT for public consumption. The main
 * data path for posts is direct DB access from server components.
 *
 * Query params:
 *   ?slug=<slug>          fetch a single post by slug (includes body)
 *   ?tag=<tag>            filter by tag
 *   ?limit=<n>            cap results (default 50, max 200)
 *   ?skip=<n>             pagination offset
 *   ?featured=true        only featured posts
 *
 * Response:
 *   200 with {posts: [...]} or {post: {...}}
 *   401 if secret missing or wrong
 *   404 if slug not found
 *
 * Security:
 *   - Constant-time string comparison to avoid timing-based secret leaks
 *   - X-Robots-Tag noindex on every response
 *   - Fails closed if INTERNAL_API_SECRET is not set in env
 */

export const dynamic = 'force-dynamic';

const SECRET_HEADER = 'x-internal-secret';

function timingSafeEqual(a: string, b: string): boolean {
    if (a.length !== b.length) return false;
    let mismatch = 0;
    for (let i = 0; i < a.length; i++) {
        mismatch |= a.charCodeAt(i) ^ b.charCodeAt(i);
    }
    return mismatch === 0;
}

function unauthorized(): NextResponse {
    return NextResponse.json(
        {error: 'Unauthorized'},
        {
            status: 401,
            headers: {
                'X-Robots-Tag': 'noindex, nofollow, noarchive',
                'WWW-Authenticate': 'InternalSecret',
            },
        },
    );
}

function checkSecret(request: NextRequest): boolean {
    const expected = process.env.INTERNAL_API_SECRET;
    if (!expected) {
        console.error('[api/posts] INTERNAL_API_SECRET is not set — refusing all requests.');
        return false;
    }
    const provided = request.headers.get(SECRET_HEADER);
    if (!provided) return false;
    return timingSafeEqual(provided, expected);
}

export async function GET(request: NextRequest): Promise<NextResponse> {
    if (!checkSecret(request)) {
        return unauthorized();
    }

    const noIndexHeaders = {
        'X-Robots-Tag': 'noindex, nofollow, noarchive',
        'Cache-Control': 'no-store',
    };

    const {searchParams} = new URL(request.url);
    const slug = searchParams.get('slug');

    if (slug) {
        const post = await getPostBySlug(slug);
        if (!post) {
            return NextResponse.json({error: 'Post not found'}, {status: 404, headers: noIndexHeaders});
        }
        return NextResponse.json({post}, {headers: noIndexHeaders});
    }

    const tag = searchParams.get('tag') ?? undefined;
    const featuredParam = searchParams.get('featured');
    const featured = featuredParam === 'true' ? true : featuredParam === 'false' ? false : undefined;

    const limitRaw = Number(searchParams.get('limit') ?? '50');
    const limit = Number.isFinite(limitRaw) ? Math.min(Math.max(limitRaw, 1), 200) : 50;

    const skipRaw = Number(searchParams.get('skip') ?? '0');
    const skip = Number.isFinite(skipRaw) ? Math.max(skipRaw, 0) : 0;

    const posts = await getPublishedPosts({tag, featured, limit, skip});
    return NextResponse.json(
        {
            posts,
            count: posts.length,
            query: {tag, featured, limit, skip},
        },
        {headers: noIndexHeaders},
    );
}
