import type {Metadata} from 'next';
import dynamic from 'next/dynamic';

import PageBreadcrumbs from '../../components/Layout/PageBreadcrumbs';
import ContactCTA from '../../components/Sections/ContactCTA';
import Footer from '../../components/Sections/Footer';
import Header from '../../components/Sections/Header';
import HireHero from '../../components/Sections/HireHero';
import Services from '../../components/Sections/Services';
import {hirePitch, hireServices} from '../../data/data';

const FavoriteTech = dynamic(() => import('../../components/Sections/FavoriteTech'));
const Testimonials = dynamic(() => import('../../components/Sections/Testimonials'));

const siteUrl = (process.env.SITE_URL || 'https://george.khananaev.com').replace(/\/$/, '');
const pageUrl = `${siteUrl}/work-with-me`;
const title = 'Work with me | George Khananaev';
const description =
    'Senior full stack engineer & fractional CTO for system architecture, AI & LLM integration, DevOps, and engineering leadership. Remote worldwide, based in Bangkok.';

export const metadata: Metadata = {
    title,
    description,
    alternates: {
        canonical: pageUrl,
    },
    openGraph: {
        type: 'profile',
        siteName: 'George Khananaev',
        title,
        description,
        url: pageUrl,
        images: [{
            url: '/og-image.png?v=2',
            width: 1200,
            height: 630,
            alt: 'George Khananaev, Full Stack Engineer & Tech Lead',
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
};

export default function WorkWithMe() {
    const jsonLd = {
        '@context': 'https://schema.org',
        '@graph': [
            {
                '@type': 'ProfessionalService',
                '@id': `${pageUrl}/#service`,
                name: 'George Khananaev, Full Stack Engineer & Tech Lead',
                url: pageUrl,
                image: `${siteUrl}/og-profile.jpg`,
                provider: {'@id': `${siteUrl}/#person`},
                areaServed: 'Worldwide',
                serviceType: [
                    'System Architecture & Technical Design',
                    'Senior Full Stack Development',
                    'AI & LLM Integration',
                    'Workflow Automation',
                    'Business Process Automation',
                    'API Integration',
                    'Web Scraping & Data Pipelines',
                    'Performance & Cost Optimization',
                    'DevOps & Cloud Infrastructure',
                    'Docker & Kubernetes',
                    'CI/CD Pipelines',
                    'Security & Compliance Engineering',
                    'OAuth & JWT Authentication',
                    'SOC2 & GDPR Readiness',
                    'Engineering Leadership',
                    'Fractional CTO',
                    'Legacy Modernization',
                    'Technical Due Diligence',
                ],
                description: hirePitch.summary,
                hasOfferCatalog: {
                    '@type': 'OfferCatalog',
                    name: 'Engineering Services',
                    itemListElement: hireServices.map((svc, idx) => ({
                        '@type': 'Offer',
                        position: idx + 1,
                        itemOffered: {
                            '@type': 'Service',
                            name: svc.title,
                            description: svc.description,
                        },
                    })),
                },
            },
            {
                '@type': 'BreadcrumbList',
                itemListElement: [
                    {'@type': 'ListItem', position: 1, name: 'Home', item: siteUrl},
                    {'@type': 'ListItem', position: 2, name: 'Work with me', item: pageUrl},
                ],
            },
        ],
    };

    return (
        <>
            <script dangerouslySetInnerHTML={{__html: JSON.stringify(jsonLd)}} type="application/ld+json" />
            <Header />
            <main className="relative">
                <PageBreadcrumbs
                    items={[
                        {label: 'Home', href: '/'},
                        {label: 'Work with me'},
                    ]}
                />
                <HireHero />
                <Services />
                <FavoriteTech />
                <Testimonials />
                <ContactCTA />
            </main>
            <Footer />
        </>
    );
}
