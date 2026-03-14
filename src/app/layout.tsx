import type {Metadata} from 'next';

import RecaptchaProvider from '../components/RecaptchaProvider';

import './globals.css';

const description = "Results-oriented developer with extensive expertise in developing ecommerce automations and comprehensive Python-based business applications. Known for innovative thinking, consistently introducing fresh ideas and enhancements to drive project success.";

export const metadata: Metadata = {
    metadataBase: new URL(process.env.SITE_URL || 'https://george.khananaev.com'),
    title: 'George Khananaev',
    description,
    openGraph: {
        title: 'George Khananaev',
        description,
        url: 'https://github.com/georgekhananaev/resume-website',
        images: '/george_khanaanev_profile.webp',
    },
    twitter: {
        title: 'George Khananaev',
        description,
    },
    verification: {
        google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION,
    },
    alternates: {
        canonical: 'https://github.com/georgekhananaev/resume-website',
    },
    icons: {
        icon: '/favicon.ico',
    },
    manifest: '/site.webmanifest',
    other: {
        google: 'notranslate',
    },
};

export default function RootLayout({children}: {children: React.ReactNode}) {
    return (
        <html lang="en">
            <body className="bg-black">
                <RecaptchaProvider>
                    {children}
                </RecaptchaProvider>
            </body>
        </html>
    );
}
