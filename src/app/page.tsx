import dynamic from 'next/dynamic';

import PageBreadcrumbs from '../components/Layout/PageBreadcrumbs';
import About from '../components/Sections/About';
import Footer from '../components/Sections/Footer';
import Header from '../components/Sections/Header';
import Hero from '../components/Sections/Hero';
import Resume from '../components/Sections/Resume';

const GithubStats = dynamic(() => import('../components/Sections/GithubStats'));

export const revalidate = 3600;

export default function Home() {
    const siteUrl = (process.env.SITE_URL || 'https://george.khananaev.com').replace(/\/$/, '');
    const jsonLd = {
        '@context': 'https://schema.org',
        '@graph': [
            {
                '@type': 'Person',
                '@id': `${siteUrl}/#person`,
                name: 'George Khananaev',
                givenName: 'George',
                familyName: 'Khananaev',
                url: siteUrl,
                image: `${siteUrl}/og-profile.jpg`,
                jobTitle: 'Head of Development & IT Infrastructure',
                worksFor: {'@type': 'Organization', name: 'Moon Holidays', url: 'https://moonholidays.co.th'},
                sameAs: [
                    'https://github.com/georgekhananaev',
                    'https://www.linkedin.com/in/georgekhananaev/',
                ],
                knowsAbout: [
                    'Python', 'TypeScript', 'JavaScript', 'Swift', 'Node.js',
                    'FastAPI', 'Next.js', 'React', 'Tailwind CSS', 'Pydantic',
                    'AI', 'LLMs', 'Claude', 'OpenAI', 'Ollama', 'Prompt Engineering',
                    'Docker', 'Kubernetes', 'AWS', 'Google Cloud', 'Oracle Cloud',
                    'MongoDB', 'PostgreSQL', 'MySQL', 'Redis', 'Elasticsearch',
                    'Microservices', 'Multi-Tenant Architecture', 'CI/CD', 'DevOps',
                    'System Design', 'WebSocket', 'GraphQL', 'REST API',
                    'Workflow Automation', 'Security & Compliance', 'Fractional CTO',
                ],
                description: 'Senior Full Stack Developer specializing in Python, TypeScript, and Swift. Currently Head of Development & IT Infrastructure at Moon Holidays, Bangkok — building scalable multi-tenant platforms, real-time data pipelines, and AI-driven enterprise systems.',
                nationality: {'@type': 'Country', name: 'Israel'},
                address: {'@type': 'PostalAddress', addressLocality: 'Bangkok', addressCountry: 'TH'},
                knowsLanguage: [
                    {'@type': 'Language', name: 'Hebrew'},
                    {'@type': 'Language', name: 'Russian'},
                    {'@type': 'Language', name: 'English'},
                    {'@type': 'Language', name: 'Thai'},
                ],
                hasOccupation: {
                    '@type': 'Occupation',
                    name: 'Full Stack Developer',
                    skills: 'Python, TypeScript, Swift, FastAPI, Next.js, React, Docker, AWS, AI, LLMs, System Architecture',
                    occupationLocation: {'@type': 'Country', name: 'Thailand'},
                },
                alumniOf: [
                    {'@type': 'EducationalOrganization', name: 'HackerU College'},
                    {'@type': 'EducationalOrganization', name: 'CampusIL'},
                ],
            },
            {
                '@type': 'WebSite',
                '@id': `${siteUrl}/#website`,
                url: siteUrl,
                name: 'Senior Full Stack Developer | George Khananaev',
                alternateName: 'George Khananaev Portfolio',
                description: 'Portfolio and resume of George Khananaev, Senior Full Stack Developer and Head of Development & IT Infrastructure at Moon Holidays, Bangkok.',
                inLanguage: 'en-US',
                publisher: {'@id': `${siteUrl}/#person`},
            },
            {
                '@type': 'WebPage',
                '@id': `${siteUrl}/#webpage`,
                url: siteUrl,
                name: 'Senior Full Stack Developer | George Khananaev',
                description: 'Senior Full Stack Developer specializing in Python, TypeScript, and Swift. Head of Development & IT Infrastructure at Moon Holidays — building scalable multi-tenant platforms and AI-driven enterprise systems.',
                isPartOf: {'@id': `${siteUrl}/#website`},
                about: {'@id': `${siteUrl}/#person`},
                inLanguage: 'en-US',
            },
        ],
    };

    return (
        <>
            <script dangerouslySetInnerHTML={{__html: JSON.stringify(jsonLd)}} type="application/ld+json" />
            <Header />
            <main className="relative">
                <PageBreadcrumbs items={[{label: 'Home'}]} />
                <Hero />
                <About />
                <Resume />
                <GithubStats />
            </main>
            <Footer />
        </>
    );
}
