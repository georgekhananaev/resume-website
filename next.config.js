/** @type {import('next').NextConfig} */
const nextConfig = {
    compress: true,
    generateEtags: true,
    pageExtensions: ['tsx', 'mdx', 'ts'],
    poweredByHeader: false,
    productionBrowserSourceMaps: false,
    trailingSlash: false,
    images: {
        remotePatterns: [
            {protocol: 'https', hostname: 'images.unsplash.com'},
            {protocol: 'https', hostname: 'source.unsplash.com'},
        ],
    },
    async headers() {
        return [
            {
                source: '/(.*)',
                headers: [
                    {key: 'X-Frame-Options', value: 'DENY'},
                    {key: 'X-Content-Type-Options', value: 'nosniff'},
                    {key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin'},
                    {key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()'},
                    {key: 'Strict-Transport-Security', value: 'max-age=63072000; includeSubDomains; preload'},
                ],
            },
        ];
    },
};

module.exports = nextConfig;
