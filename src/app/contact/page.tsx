import type {Metadata} from 'next';

import PageBreadcrumbs from '../../components/Layout/PageBreadcrumbs';
import PageHero from '../../components/Layout/PageHero';
import Contact from '../../components/Sections/Contact';
import Footer from '../../components/Sections/Footer';
import Header from '../../components/Sections/Header';
import {contact} from '../../data/data';
import {buildBreadcrumbList} from '../../lib/breadcrumb';

const siteUrl = (process.env.SITE_URL || 'https://george.khananaev.com').replace(/\/$/, '');
const pageUrl = `${siteUrl}/contact`;
const title = 'Contact | George Khananaev';
const description =
    'Get in touch with George Khananaev, Software Architect in Bangkok. Available for senior engineering, technical consulting, and fractional CTO work.';

export const metadata: Metadata = {
    title,
    description,
    alternates: {canonical: pageUrl},
    openGraph: {
        type: 'website',
        siteName: 'George Khananaev',
        title,
        description,
        url: pageUrl,
        images: [
            {
                url: '/og-image.png?v=2',
                width: 1200,
                height: 630,
                alt: 'George Khananaev',
                type: 'image/png',
            },
        ],
        locale: 'en_US',
    },
    twitter: {
        card: 'summary_large_image',
        title,
        description,
        images: ['/og-image.png?v=2'],
    },
};

export default function ContactPage() {
    const jsonLd = {
        '@context': 'https://schema.org',
        '@graph': [
            {
                '@type': 'ContactPage',
                '@id': `${pageUrl}/#contactpage`,
                url: pageUrl,
                name: title,
                description,
                isPartOf: {'@id': `${siteUrl}/#website`},
                about: {'@id': `${siteUrl}/#person`},
                mainEntity: {
                    '@type': 'Person',
                    '@id': `${siteUrl}/#person`,
                    name: 'George Khananaev',
                    url: siteUrl,
                    contactPoint: contact.items.map(item => ({
                        '@type': 'ContactPoint',
                        contactType: item.type,
                        url: item.href,
                        name: item.text,
                    })),
                },
            },
            buildBreadcrumbList([
                {name: 'Home', url: siteUrl},
                {name: 'Contact', url: pageUrl},
            ]),
        ],
    };

    return (
        <>
            <script dangerouslySetInnerHTML={{__html: JSON.stringify(jsonLd)}} type="application/ld+json" />
            <Header />
            <main className="relative bg-neutral-950">
                <PageBreadcrumbs
                    items={[
                        {label: 'Home', href: '/'},
                        {label: 'Contact'},
                    ]}
                />
                <PageHero
                    description="Use the form below for project inquiries, freelance work, or general questions. For serious engagements please include your WhatsApp number for a faster response."
                    eyebrow="Contact"
                    subtitle="Send a message, get a reply"
                    title="Get in touch"
                />

                <Contact />
            </main>
            <Footer />
        </>
    );
}
