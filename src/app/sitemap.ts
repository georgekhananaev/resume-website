import type {MetadataRoute} from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
    const siteUrl = (process.env.SITE_URL || 'https://george.khananaev.com').replace(/\/$/, '');

    return [
        {
            url: siteUrl,
            lastModified: new Date(),
            changeFrequency: 'monthly',
            priority: 1,
        },
    ];
}
