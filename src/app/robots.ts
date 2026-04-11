import type {MetadataRoute} from 'next';

export default function robots(): MetadataRoute.Robots {
    const siteUrl = (process.env.SITE_URL || 'https://george.khananaev.com').replace(/\/$/, '');

    return {
        rules: [
            {
                userAgent: '*',
                allow: '/',
                disallow: ['/404', '/500', '/admin', '/api/admin', '/api/posts'],
            },
            {
                userAgent: ['GPTBot', 'ChatGPT-User', 'Google-Extended', 'PerplexityBot', 'ClaudeBot', 'Applebot-Extended'],
                allow: '/',
                disallow: ['/admin', '/api/admin', '/api/posts'],
            },
        ],
        sitemap: `${siteUrl}/sitemap.xml`,
    };
}
