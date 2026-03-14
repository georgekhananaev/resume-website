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

    return (
        <>
            <Header />
            <Hero />
            <About />
            <Resume />
            <FavoriteTech />
            <GithubStats />
            <Portfolio starCounts={starCounts} />
            <Testimonials />
            <Contact />
            <Footer />
        </>
    );
}
