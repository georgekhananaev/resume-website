/** @type {import('next').NextConfig} */

// Content-Security-Policy
// --------------------------------------------------------------------------
// Pragmatic CSP for a Next.js 16 App Router site that uses reCAPTCHA v3,
// EmailJS, and live GitHub stats. 'unsafe-inline' + 'unsafe-eval' on script-src
// are unfortunately required by Next's hydration/runtime scripts; tightening
// those further requires a nonce middleware, which is future work. Everything
// else is locked down as far as the runtime allows.
const cspDirectives = {
    'default-src': ["'self'"],
    'script-src': [
        "'self'",
        "'unsafe-inline'",
        "'unsafe-eval'",
        'https://www.google.com',
        'https://www.gstatic.com',
    ],
    'style-src': ["'self'", "'unsafe-inline'"],
    'img-src': [
        "'self'",
        'data:',
        'blob:',
        'https://images.unsplash.com',
        'https://source.unsplash.com',
        'https://res.cloudinary.com',
        'https://avatars.githubusercontent.com',
        'https://github.githubassets.com',
    ],
    'font-src': ["'self'", 'data:'],
    'connect-src': [
        "'self'",
        'https://www.google.com',
        'https://api.emailjs.com',
        'https://api.github.com',
    ],
    'frame-src': ['https://www.google.com'],
    'object-src': ["'none'"],
    'base-uri': ["'self'"],
    'form-action': ["'self'"],
    'frame-ancestors': ["'none'"],
    'upgrade-insecure-requests': [],
};
const cspHeader = Object.entries(cspDirectives)
    .map(([k, v]) => (v.length ? `${k} ${v.join(' ')}` : k))
    .join('; ');

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
            {protocol: 'https', hostname: 'res.cloudinary.com'},
        ],
    },
    async headers() {
        return [
            {
                source: '/(.*)',
                headers: [
                    {key: 'Content-Security-Policy', value: cspHeader},
                    {key: 'X-Frame-Options', value: 'DENY'},
                    {key: 'X-Content-Type-Options', value: 'nosniff'},
                    {key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin'},
                    {key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()'},
                    {key: 'Strict-Transport-Security', value: 'max-age=63072000; includeSubDomains; preload'},
                ],
            },
            {
                source: '/api/posts/:path*',
                headers: [
                    {key: 'X-Robots-Tag', value: 'noindex, nofollow, noarchive'},
                ],
            },
            {
                source: '/admin/:path*',
                headers: [
                    {key: 'X-Robots-Tag', value: 'noindex, nofollow, noarchive'},
                ],
            },
        ];
    },
    async redirects() {
        return [
            {
                source: '/hire-me',
                destination: '/work-with-me',
                permanent: true,
            },
        ];
    },
};

module.exports = nextConfig;
