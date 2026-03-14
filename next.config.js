/** @type {import('next').NextConfig} */
const nextConfig = {
    compress: true,
    generateEtags: true,
    pageExtensions: ['tsx', 'mdx', 'ts'],
    poweredByHeader: false,
    productionBrowserSourceMaps: false,
    trailingSlash: false,
    reactStrictMode: true,
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'images.unsplash.com',
            },
            {
                protocol: 'https',
                hostname: 'source.unsplash.com',
            },
        ],
    },
};

module.exports = nextConfig;
