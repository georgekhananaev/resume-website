import {execSync} from 'child_process';
import type {MetadataRoute} from 'next';

import {getLatestPostUpdatedAt, getPublishedPosts, getTagStats} from '../lib/posts';

export const revalidate = 3600;

// Tags with fewer than this many posts are considered thin archives and are
// excluded from the sitemap + marked noindex on the page itself. Google
// routinely skips thin tag pages, which wastes crawl budget.
const MIN_TAG_POSTS_FOR_INDEX = 3;

function getLastModified(): Date {
    try {
        const iso = execSync('git log -1 --format=%cI', {encoding: 'utf-8'}).trim();
        if (iso) return new Date(iso);
    } catch {
        // fall through
    }
    return new Date();
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const siteUrl = (process.env.SITE_URL || 'https://george.khananaev.com').replace(/\/$/, '');
    const gitLastMod = getLastModified();

    let postRoutes: MetadataRoute.Sitemap = [];
    let tagRoutes: MetadataRoute.Sitemap = [];
    let portfolioLastMod: Date = gitLastMod;

    try {
        const [posts, tagStats, latestPostUpdate] = await Promise.all([
            getPublishedPosts({limit: 1000}),
            getTagStats(),
            getLatestPostUpdatedAt(),
        ]);

        if (latestPostUpdate) portfolioLastMod = latestPostUpdate;

        postRoutes = posts.map(post => ({
            url: `${siteUrl}/portfolio/${post.slug}`,
            lastModified: new Date(post.updatedAt),
            changeFrequency: 'monthly' as const,
            priority: post.featured ? 0.9 : 0.75,
        }));

        tagRoutes = tagStats
            .filter(t => t.count >= MIN_TAG_POSTS_FOR_INDEX)
            .map(t => ({
                url: `${siteUrl}/portfolio/tag/${t.tag}`,
                lastModified: new Date(t.latestUpdatedAt),
                changeFrequency: 'monthly' as const,
                priority: 0.5,
            }));
    } catch (err) {
        // If MongoDB is unreachable at build time, ship the static routes
        // rather than failing the entire build.
        console.error('[sitemap] Could not fetch posts/tags from MongoDB:', err);
    }

    const staticRoutes: MetadataRoute.Sitemap = [
        {
            url: siteUrl,
            lastModified: gitLastMod,
            changeFrequency: 'monthly',
            priority: 1,
        },
        {
            url: `${siteUrl}/work-with-me`,
            lastModified: gitLastMod,
            changeFrequency: 'monthly',
            priority: 0.9,
        },
        {
            url: `${siteUrl}/portfolio`,
            lastModified: portfolioLastMod,
            changeFrequency: 'weekly',
            priority: 0.95,
        },
        {
            url: `${siteUrl}/contact`,
            lastModified: gitLastMod,
            changeFrequency: 'yearly',
            priority: 0.8,
        },
    ];

    return [...staticRoutes, ...postRoutes, ...tagRoutes];
}
