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
        ],
        sitemap: `${siteUrl}/sitemap.xml`,
    };
}
