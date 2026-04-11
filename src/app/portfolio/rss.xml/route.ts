import {Feed} from 'feed';

import {getPublishedPosts} from '../../../lib/posts';

export const revalidate = 3600;

const siteUrl = (process.env.SITE_URL || 'https://george.khananaev.com').replace(/\/$/, '');

export async function GET(): Promise<Response> {
    const posts = await getPublishedPosts({limit: 100});

    const feed = new Feed({
        title: 'George Khananaev — Portfolio',
        description: 'Case studies, technical deep-dives, and open-source projects by George Khananaev.',
        id: `${siteUrl}/portfolio`,
        link: `${siteUrl}/portfolio`,
        language: 'en',
        image: `${siteUrl}/og-profile.jpg`,
        favicon: `${siteUrl}/favicon.ico`,
        copyright: `© ${new Date().getFullYear()} George Khananaev`,
        updated: posts[0] ? new Date(posts[0].updatedAt) : new Date(),
        feedLinks: {
            rss: `${siteUrl}/portfolio/rss.xml`,
        },
        author: {
            name: 'George Khananaev',
            email: undefined,
            link: siteUrl,
        },
    });

    for (const post of posts) {
        const postUrl = `${siteUrl}/portfolio/${post.slug}`;
        feed.addItem({
            title: post.title,
            id: postUrl,
            link: postUrl,
            description: post.excerpt,
            content: post.excerpt,
            author: [{name: post.author.name, link: post.author.url}],
            date: new Date(post.publishedAt),
            image: post.thumbnail.url.startsWith('http') ? post.thumbnail.url : `${siteUrl}${post.thumbnail.url}`,
            category: post.tags.map(t => ({name: t})),
        });
    }

    return new Response(feed.rss2(), {
        headers: {
            'Content-Type': 'application/rss+xml; charset=utf-8',
            'Cache-Control': 'public, max-age=3600, s-maxage=3600',
        },
    });
}
