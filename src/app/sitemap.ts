import {execSync} from 'child_process';
import type {MetadataRoute} from 'next';

import {getAllTags, getPublishedPosts} from '../lib/posts';

export const revalidate = 3600;

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
            lastModified: new Date(),
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

    let postRoutes: MetadataRoute.Sitemap = [];
    let tagRoutes: MetadataRoute.Sitemap = [];

    try {
        const [posts, tags] = await Promise.all([getPublishedPosts({limit: 1000}), getAllTags()]);

        postRoutes = posts.map(post => ({
            url: `${siteUrl}/portfolio/${post.slug}`,
            lastModified: new Date(post.updatedAt),
            changeFrequency: 'monthly' as const,
            priority: post.featured ? 0.9 : 0.75,
        }));

        tagRoutes = tags.map(tag => ({
            url: `${siteUrl}/portfolio/tag/${tag}`,
            lastModified: new Date(),
            changeFrequency: 'weekly' as const,
            priority: 0.5,
        }));
    } catch (err) {
        // If MongoDB is unreachable at build time, ship the static routes
        // rather than failing the entire build.
        console.error('[sitemap] Could not fetch posts/tags from MongoDB:', err);
    }

    return [...staticRoutes, ...postRoutes, ...tagRoutes];
}
