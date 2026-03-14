import dynamic from 'next/dynamic';

import About from '../components/Sections/About';
import Footer from '../components/Sections/Footer';
import Header from '../components/Sections/Header';
import Hero from '../components/Sections/Hero';
import Resume from '../components/Sections/Resume';
import {portfolioItems} from '../data/data';

const FavoriteTech = dynamic(() => import('../components/Sections/FavoriteTech'));
const GithubStats = dynamic(() => import('../components/Sections/GithubStats'));
const Portfolio = dynamic(() => import('../components/Sections/Portfolio'));
const Testimonials = dynamic(() => import('../components/Sections/Testimonials'));
const Contact = dynamic(() => import('../components/Sections/Contact'));

export const revalidate = 3600;

async function getStarCounts(): Promise<Record<string, number>> {
    const token = process.env.GITHUB_TOKEN;
    const headers: HeadersInit = token
        ? {'Authorization': `Bearer ${token}`, 'Accept': 'application/vnd.github.v3+json'}
        : {'Accept': 'application/vnd.github.v3+json'};

    const stars: Record<string, number> = {};

    try {
        const repoNames = portfolioItems
            .map(item => {
                const match = item.url.match(/github\.com\/[^/]+\/([^/]+)/);
                return match ? match[1] : null;
            })
            .filter(Boolean) as string[];

        const username = process.env.GITHUB_USERNAME || 'georgekhananaev';

        await Promise.all(
            repoNames.map(async (repo) => {
                try {
                    const res = await fetch(`https://api.github.com/repos/${username}/${repo}`, {
                        headers,
                        next: {revalidate: 3600},
                    });
                    if (res.ok) {
                        const data = await res.json();
                        stars[repo] = data.stargazers_count;
                    }
                } catch {
                    // skip
                }
            }),
        );
    } catch {
        // return empty on failure
    }

    return stars;
}

export default async function Home() {
    const starCounts = await getStarCounts();

    const siteUrl = (process.env.SITE_URL || 'https://george.khananaev.com').replace(/\/$/, '');
    const jsonLd = {
        '@context': 'https://schema.org',
        '@graph': [
            {
                '@type': 'Person',
                '@id': `${siteUrl}/#person`,
                name: 'George Khananaev',
                url: siteUrl,
                image: `${siteUrl}/og-image.png`,
                jobTitle: 'Head of Development',
                worksFor: {'@type': 'Organization', name: 'Moon Holidays', url: 'https://www.moonholidays.com'},
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
                ],
                description: 'Full Stack Developer & Head of Development specializing in Python, TypeScript, Swift & AI-driven enterprise applications. Building scalable multi-tenant platforms, real-time data pipelines, and cloud infrastructure.',
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
                name: 'George Khananaev — Full Stack Developer & Head of Development',
                description: 'Portfolio and resume of George Khananaev, a Full Stack Developer specializing in Python, TypeScript, Swift & AI-driven enterprise applications.',
                inLanguage: 'en-US',
                publisher: {'@id': `${siteUrl}/#person`},
            },
            {
                '@type': 'WebPage',
                '@id': `${siteUrl}/#webpage`,
                url: siteUrl,
                name: 'George Khananaev | Full Stack Developer & Head of Development',
                description: 'Full Stack Developer specializing in Python, TypeScript & AI-driven enterprise applications. Building scalable multi-tenant platforms and cloud infrastructure.',
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
            <main>
                <Hero />
                <About />
                <Resume />
                <FavoriteTech />
                <GithubStats />
                <Portfolio starCounts={starCounts} />
                <Testimonials />
                <Contact />
            </main>
            <Footer />
        </>
    );
}
