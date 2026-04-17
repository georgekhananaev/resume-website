import './globals.css';

import type {Metadata, Viewport} from 'next';

const siteUrl = (process.env.SITE_URL || 'https://george.khananaev.com').replace(/\/$/, '');
const title = 'Software Architect | George Khananaev';
const description = 'Software Architect in Bangkok. Head of Development at Moon Holidays, building multi-tenant platforms, real-time pipelines, and AI-driven enterprise systems.';

export const viewport: Viewport = {
    width: 'device-width',
    initialScale: 1,
};

export const metadata: Metadata = {
    metadataBase: new URL(siteUrl),
    title,
    description,
    robots: {
        index: true,
        follow: true,
        googleBot: {
            index: true,
            follow: true,
            'max-video-preview': -1,
            'max-image-preview': 'large',
            'max-snippet': -1,
        },
    },
    openGraph: {
        type: 'profile',
        siteName: 'George Khananaev',
        firstName: 'George',
        lastName: 'Khananaev',
        username: 'georgekhananaev',
        gender: 'male',
        title,
        description,
        url: siteUrl,
        images: [{
            url: '/og-image.png?v=2',
            width: 1200,
            height: 630,
            alt: 'George Khananaev, Software Architect',
            type: 'image/png',
        }],
        locale: 'en_US',
    },
    twitter: {
        card: 'summary_large_image',
        title,
        description,
        images: ['/og-image.png?v=2'],
    },
    verification: {
        google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION,
    },
    alternates: {
        canonical: siteUrl,
        languages: {
            'en-US': siteUrl,
            'x-default': siteUrl,
        },
    },
    formatDetection: {
        telephone: false,
        date: false,
        address: false,
        email: false,
    },
    icons: {
        icon: '/favicon.ico',
        apple: '/apple-touch-icon.png',
    },
    manifest: '/site.webmanifest',
    authors: [{name: 'George Khananaev', url: siteUrl}],
    creator: 'George Khananaev',
    publisher: 'George Khananaev',
    other: {
        google: 'notranslate',
    },
};

export default function RootLayout({children}: {children: React.ReactNode}) {
    return (
        <html data-scroll-behavior="smooth" lang="en">
            <head>
                <link href="https://www.google.com" rel="preconnect" />
                <link href="https://api.github.com" rel="preconnect" />
                <link href="https://www.google.com" rel="dns-prefetch" />
            </head>
            <body className="bg-black">
                <a className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded focus:bg-indigo-500 focus:px-4 focus:py-2 focus:text-white" href="#about">
                    Skip to main content
                </a>
                {children}
            </body>
        </html>
    );
}
