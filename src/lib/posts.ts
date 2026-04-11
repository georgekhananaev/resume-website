import 'server-only';

import type {Filter, Sort} from 'mongodb';

import type {PortfolioType, Post, PostStatus, PostSummary} from '../types/post';
import {getDb, POSTS_COLLECTION} from './db';

/**
 * Serialize an ObjectId to a string so the Post can cross the server/client
 * component boundary. Dates are kept as Date objects — Next.js serializes
 * them automatically.
 */
function serializePost<T extends Post>(doc: T): T {
    if (doc._id && typeof doc._id !== 'string') {
        return {...doc, _id: doc._id.toString()};
    }
    return doc;
}

function serializeMany<T extends Post>(docs: T[]): T[] {
    return docs.map(serializePost);
}

interface ListOptions {
    limit?: number;
    skip?: number;
    tag?: string;
    category?: string;
    status?: PostStatus;
    featured?: boolean;
    portfolioType?: PortfolioType;
    sort?: Sort;
}

/**
 * Fetch published posts with optional filters. Defaults to published-only,
 * newest-first, capped at 100.
 *
 * Note: portfolioType filter treats undefined stored values as 'public'
 * (so existing posts without the field still show up in the public list).
 */
export async function getPublishedPosts(opts: ListOptions = {}): Promise<PostSummary[]> {
    const db = await getDb();
    const collection = db.collection<Post>(POSTS_COLLECTION);

    const filter: Filter<Post> = {
        status: opts.status ?? 'published',
    };
    if (opts.tag) filter.tags = opts.tag;
    if (opts.category) filter.category = opts.category as Post['category'];
    if (opts.featured !== undefined) filter.featured = opts.featured;

    if (opts.portfolioType === 'commercial') {
        filter.portfolioType = 'commercial';
    } else if (opts.portfolioType === 'public') {
        // Match docs with portfolioType: 'public' OR docs that don't have the field set
        // (backwards compatibility for posts seeded before the split).
        filter.$or = [{portfolioType: 'public'}, {portfolioType: {$exists: false}}];
    }

    const cursor = collection
        .find(filter, {projection: {content: 0}})
        .sort(opts.sort ?? {publishedAt: -1})
        .skip(opts.skip ?? 0)
        .limit(opts.limit ?? 100);

    const docs = (await cursor.toArray()) as unknown as PostSummary[];
    return serializeMany(docs as unknown as Post[]) as unknown as PostSummary[];
}

/**
 * Public portfolio posts — open-source projects with GitHub URLs.
 */
export async function getPublicPortfolioPosts(limit: number = 100): Promise<PostSummary[]> {
    return getPublishedPosts({portfolioType: 'public', limit});
}

/**
 * Commercial portfolio posts — paid client/employer work.
 */
export async function getCommercialPortfolioPosts(limit: number = 100): Promise<PostSummary[]> {
    return getPublishedPosts({portfolioType: 'commercial', limit});
}

/**
 * Fetch a single published post by slug. Returns null if missing or not published.
 * Also checks previousSlugs for 301-style redirect support.
 */
export async function getPostBySlug(slug: string): Promise<Post | null> {
    const db = await getDb();
    const collection = db.collection<Post>(POSTS_COLLECTION);

    const doc = await collection.findOne({
        status: 'published',
        $or: [{slug}, {previousSlugs: slug}],
    });

    if (!doc) return null;
    return serializePost(doc as Post);
}

/**
 * Featured posts for the /portfolio hero row. Sorted by pinned first, then
 * recency. Limit defaults to 3.
 */
export async function getFeaturedPosts(limit: number = 3): Promise<PostSummary[]> {
    const db = await getDb();
    const collection = db.collection<Post>(POSTS_COLLECTION);

    const docs = await collection
        .find({status: 'published', featured: true}, {projection: {content: 0}})
        .sort({pinned: -1, publishedAt: -1})
        .limit(limit)
        .toArray();

    return serializeMany(docs as Post[]) as unknown as PostSummary[];
}

/**
 * Related posts algorithm:
 *   1. Find other published posts that share at least one tag.
 *   2. Score by tag-overlap count (most overlap = most related).
 *   3. Tie-break by recency.
 *   4. Never include the current post.
 *   5. Pad with recent posts if fewer than `limit` matches.
 */
export async function getRelatedPosts(currentSlug: string, tags: string[], limit: number = 3): Promise<PostSummary[]> {
    if (tags.length === 0) return [];

    const db = await getDb();
    const collection = db.collection<Post>(POSTS_COLLECTION);

    const candidates = await collection
        .find(
            {
                status: 'published',
                slug: {$ne: currentSlug},
                tags: {$in: tags},
            },
            {projection: {content: 0}},
        )
        .toArray();

    const scored = (candidates as Post[])
        .map(p => ({
            post: p,
            score: p.tags.filter(t => tags.includes(t)).length,
            published: p.publishedAt ? new Date(p.publishedAt).getTime() : 0,
        }))
        .sort((a, b) => {
            if (b.score !== a.score) return b.score - a.score;
            return b.published - a.published;
        })
        .slice(0, limit)
        .map(entry => entry.post);

    return serializeMany(scored) as unknown as PostSummary[];
}

/**
 * All published slugs for Next.js generateStaticParams.
 */
export async function getAllSlugsForStaticParams(): Promise<{slug: string}[]> {
    const db = await getDb();
    const collection = db.collection<Post>(POSTS_COLLECTION);

    const docs = await collection
        .find({status: 'published'}, {projection: {slug: 1, _id: 0}})
        .toArray();

    return (docs as {slug: string}[]).map(({slug}) => ({slug}));
}

/**
 * Posts tagged with a specific tag, newest-first.
 */
export async function getPostsByTag(tag: string, limit: number = 100): Promise<PostSummary[]> {
    return getPublishedPosts({tag, limit});
}

/**
 * Distinct list of all tags across published posts, for the tag cloud and
 * sitemap generation.
 */
export async function getAllTags(): Promise<string[]> {
    const db = await getDb();
    const collection = db.collection<Post>(POSTS_COLLECTION);
    const tags = await collection.distinct('tags', {status: 'published'});
    return (tags as string[]).sort();
}

/**
 * Count of published posts — useful for pagination and for deciding whether
 * to render empty states.
 */
export async function getPublishedCount(): Promise<number> {
    const db = await getDb();
    const collection = db.collection<Post>(POSTS_COLLECTION);
    return collection.countDocuments({status: 'published'});
}
