import About from '../components/Sections/About';
import Contact from '../components/Sections/Contact';
import FavoriteTech from '../components/Sections/FavoriteTech';
import Footer from '../components/Sections/Footer';
import GithubStats from '../components/Sections/GithubStats';
import Header from '../components/Sections/Header';
import Hero from '../components/Sections/Hero';
import Portfolio from '../components/Sections/Portfolio';
import Resume from '../components/Sections/Resume';
import Testimonials from '../components/Sections/Testimonials';
import {portfolioItems} from '../data/data';

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
                jobTitle: 'Head of Development',
                worksFor: {'@type': 'Organization', name: 'Moon Holidays'},
                sameAs: [
                    'https://github.com/georgekhananaev',
                    'https://www.linkedin.com/in/georgekhananaev/',
                ],
                knowsAbout: ['Python', 'TypeScript', 'Swift', 'FastAPI', 'Next.js', 'React', 'Docker', 'AWS', 'AI', 'LLMs'],
                description: 'Full Stack Developer specializing in Python, TypeScript & AI-driven enterprise applications.',
            },
            {
                '@type': 'WebSite',
                '@id': `${siteUrl}/#website`,
                url: siteUrl,
                name: 'George Khananaev',
                description: 'Full Stack Developer specializing in Python, TypeScript & AI-driven enterprise applications.',
                inLanguage: 'en-US',
                publisher: {'@id': `${siteUrl}/#person`},
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
