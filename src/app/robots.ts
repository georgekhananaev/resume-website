import type {MetadataRoute} from 'next';

export default function robots(): MetadataRoute.Robots {
    const siteUrl = (process.env.SITE_URL || 'https://george.khananaev.com').replace(/\/$/, '');

    return {
        rules: [
            {
                userAgent: '*',
                allow: '/',
                disallow: ['/404', '/500'],
            },
            {
                userAgent: ['GPTBot', 'ChatGPT-User', 'Google-Extended', 'PerplexityBot', 'ClaudeBot', 'Applebot-Extended'],
                allow: '/',
            },
        ],
        sitemap: `${siteUrl}/sitemap.xml`,
    };
}
