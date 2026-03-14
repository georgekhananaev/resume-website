import type {Metadata, Viewport} from 'next';

import RecaptchaProvider from '../components/RecaptchaProvider';

import './globals.css';

const siteUrl = (process.env.SITE_URL || 'https://george.khananaev.com').replace(/\/$/, '');
const title = 'George Khananaev | Full Stack Developer & Head of Development';
const description = 'Full Stack Developer specializing in Python, TypeScript & AI-driven enterprise applications. Building scalable multi-tenant platforms and cloud infrastructure.';

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
            url: '/og-image.png',
            width: 1200,
            height: 630,
            alt: 'George Khananaev - Full Stack Developer',
        }],
        locale: 'en_US',
    },
    twitter: {
        card: 'summary_large_image',
        title,
        description,
        images: ['/og-image.png'],
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
        <html lang="en">
            <head>
                <link href="https://www.google.com" rel="preconnect" />
                <link href="https://api.github.com" rel="preconnect" />
                <link href="https://www.google.com" rel="dns-prefetch" />
            </head>
            <body className="bg-black">
                <a className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded focus:bg-orange-500 focus:px-4 focus:py-2 focus:text-white" href="#about">
                    Skip to main content
                </a>
                <RecaptchaProvider>
                    {children}
                </RecaptchaProvider>
            </body>
        </html>
    );
}
