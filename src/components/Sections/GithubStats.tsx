import {CalendarDaysIcon, CodeBracketIcon, StarIcon, UserGroupIcon} from '@heroicons/react/24/outline';

import {SectionId} from '../../data/data';
import Section from '../Layout/Section';

interface GithubRepo {
    stargazers_count: number;
    fork: boolean;
    language: string | null;
}

interface GithubUser {
    public_repos: number;
    total_private_repos?: number;
    owned_private_repos?: number;
    followers: number;
    created_at: string;
    avatar_url: string;
    bio: string | null;
    html_url: string;
}

interface Achievement {
    name: string;
    slug: string;
    image: string;
    tier: string | null;
}

interface GithubData {
    user: GithubUser;
    totalStars: number;
    topLanguages: {name: string; percentage: number}[];
    originalRepos: number;
    achievements: Achievement[];
}

// --- In-memory cache ---
const CACHE_TTL = 60 * 60 * 1000; // 1 hour
let cached: {data: GithubData; timestamp: number} | null = null;

async function getGithubDataCached(username: string): Promise<GithubData | null> {
    if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
        return cached.data;
    }

    const data = await fetchGithubData(username);
    if (data) {
        cached = {data, timestamp: Date.now()};
    }
    return data;
}

async function fetchAllRepos(username: string, headers: HeadersInit): Promise<GithubRepo[]> {
    const allRepos: GithubRepo[] = [];
    let page = 1;
    while (true) {
        const res = await fetch(
            `https://api.github.com/users/${username}/repos?per_page=100&sort=pushed&page=${page}`,
            {cache: 'no-store', headers},
        );
        if (!res.ok) break;
        const repos: GithubRepo[] = await res.json();
        if (repos.length === 0) break;
        allRepos.push(...repos);
        if (repos.length < 100) break;
        page++;
    }
    return allRepos;
}

async function fetchGithubData(username: string): Promise<GithubData | null> {
    try {
        const token = process.env.GITHUB_TOKEN;
        const apiHeaders: HeadersInit = token
            ? {'Authorization': `Bearer ${token}`, 'Accept': 'application/vnd.github.v3+json'}
            : {'Accept': 'application/vnd.github.v3+json'};

        const [userRes, repos, profileHtml] = await Promise.all([
            fetch(`https://api.github.com/users/${username}`, {cache: 'no-store', headers: apiHeaders}),
            fetchAllRepos(username, apiHeaders),
            fetch(`https://github.com/${username}?tab=achievements`, {
                cache: 'no-store',
                headers: {'Accept': 'text/html'},
            }),
        ]);

        if (!userRes.ok) return null;

        const user: GithubUser = await userRes.json();

        const originalRepos = repos.filter(r => !r.fork);
        const totalStars = repos.reduce((sum, r) => sum + r.stargazers_count, 0);

        const langCount: Record<string, number> = {};
        for (const repo of originalRepos) {
            if (repo.language) {
                langCount[repo.language] = (langCount[repo.language] || 0) + 1;
            }
        }

        const totalLangRepos = Object.values(langCount).reduce((sum, c) => sum + c, 0);
        const topLanguages = Object.entries(langCount)
            .sort(([, a], [, b]) => b - a)
            .slice(0, 8)
            .map(([name, count]) => ({name, percentage: Math.round((count / totalLangRepos) * 100)}));

        // Parse achievements from profile HTML
        const achievements: Achievement[] = [];
        if (profileHtml.ok) {
            const html = await profileHtml.text();

            // Parse from sidebar section — most reliable, contains all achievements
            const sidebarSection = html.match(/achievement-badge-sidebar[\s\S]{0,5000}/);
            if (sidebarSection) {
                const badgePattern = /alt="Achievement: ([^"]*)"[\s\S]*?(?:achievement-tier-label[^>]*>([^<]*)<|<\/a>)/g;
                let badgeMatch;
                while ((badgeMatch = badgePattern.exec(sidebarSection[0])) !== null) {
                    const name = badgeMatch[1];
                    const slug = name.toLowerCase().replace(/\s+/g, '-');
                    if (!achievements.find(a => a.slug === slug)) {
                        const imgUrlMatch = html.match(new RegExp(`src="(https://github\\.githubassets\\.com/assets/${slug}[^"]*)"`, 'i'));
                        achievements.push({
                            name,
                            slug,
                            image: imgUrlMatch ? imgUrlMatch[1] : '',
                            tier: badgeMatch[2]?.trim() || null,
                        });
                    }
                }
            }

            // Fallback: find all achievement images directly
            if (achievements.length === 0) {
                const imgPattern = /src="(https:\/\/github\.githubassets\.com\/assets\/([a-z-]+)-[^"]+)"[^>]*alt="Achievement: ([^"]*)"/g;
                let imgMatch;
                while ((imgMatch = imgPattern.exec(html)) !== null) {
                    const slug = imgMatch[3].toLowerCase().replace(/\s+/g, '-');
                    if (!achievements.find(a => a.slug === slug)) {
                        achievements.push({
                            name: imgMatch[3],
                            slug,
                            image: imgMatch[1],
                            tier: null,
                        });
                    }
                }
            }
        }

        return {user, totalStars, topLanguages, originalRepos: originalRepos.length, achievements};
    } catch {
        return null;
    }
}

const langColors: Record<string, string> = {
    TypeScript: 'bg-blue-500',
    JavaScript: 'bg-yellow-400',
    Python: 'bg-green-500',
    Java: 'bg-red-500',
    Rust: 'bg-orange-600',
    Go: 'bg-cyan-500',
    'C++': 'bg-pink-500',
    C: 'bg-gray-400',
    'C#': 'bg-purple-500',
    Ruby: 'bg-red-600',
    PHP: 'bg-indigo-400',
    Swift: 'bg-orange-500',
    Kotlin: 'bg-violet-500',
    Dart: 'bg-sky-400',
    HTML: 'bg-orange-400',
    CSS: 'bg-blue-400',
    Shell: 'bg-emerald-500',
    Dockerfile: 'bg-sky-600',
};

export default async function GithubStats() {
    const username = process.env.GITHUB_USERNAME;
    if (!username) return null;

    const data = await getGithubDataCached(username);
    if (!data) return null;

    const {user, totalStars, topLanguages, achievements} = data;
    const yearsOnGithub = new Date().getFullYear() - new Date(user.created_at).getFullYear();
    const privateRepos = process.env.GITHUB_PRIVATE_REPOS
        ? parseInt(process.env.GITHUB_PRIVATE_REPOS, 10)
        : (user.owned_private_repos ?? 0);
    const totalRepos = user.public_repos + privateRepos;

    const stats = [
        {label: 'Repositories', value: totalRepos, Icon: CodeBracketIcon},
        {label: 'Stars Earned', value: totalStars, Icon: StarIcon},
        {label: 'Followers', value: user.followers, Icon: UserGroupIcon},
        {label: 'Years on GitHub', value: yearsOnGithub, Icon: CalendarDaysIcon},
    ];

    return (
        <Section className="bg-neutral-900" sectionId={SectionId.Github}>
            <div className="flex flex-col gap-y-8">
                <div className="flex flex-col items-center gap-y-2">
                    <h2 className="text-2xl font-bold text-white">GitHub</h2>
                    <a className="text-sm text-orange-400 transition-colors hover:text-orange-300" href={user.html_url} target="_blank">
                        @{username}
                    </a>
                </div>

                <div className="grid grid-cols-2 gap-2 sm:gap-4 md:grid-cols-4">
                    {stats.map(({label, value, Icon}) => (
                        <div className="flex flex-col items-center gap-y-1 rounded-xl bg-neutral-800/60 p-3 sm:gap-y-2 sm:p-5" key={label}>
                            <Icon className="h-5 w-5 text-orange-400 sm:h-6 sm:w-6" />
                            <span className="text-xl font-bold text-white sm:text-2xl">{value}</span>
                            <span className="text-xs text-neutral-400">{label}</span>
                        </div>
                    ))}
                </div>

                {achievements.length > 0 && (
                    <div className="flex flex-col items-center gap-y-4">
                        <h3 className="text-sm font-semibold uppercase tracking-wider text-neutral-400">Achievements</h3>
                        <div className="flex flex-wrap justify-center gap-6">
                            {achievements.map(({name, slug, image, tier}) => (
                                <a
                                    className="group flex flex-col items-center gap-y-2 transition-transform hover:scale-105"
                                    href={`https://github.com/${username}?achievement=${slug}&tab=achievements`}
                                    key={slug}
                                    target="_blank">
                                    <div className="relative">
                                        {/* eslint-disable-next-line @next/next/no-img-element */}
                                        <img
                                            alt={`Achievement: ${name}`}
                                            className="h-16 w-16 drop-shadow-lg sm:h-20 sm:w-20"
                                            src={image}
                                        />
                                        {tier && (
                                            <span className="absolute -bottom-1 -right-1 rounded-full bg-orange-500 px-1.5 py-0.5 text-[10px] font-bold text-white shadow">
                                                {tier}
                                            </span>
                                        )}
                                    </div>
                                    <span className="text-xs text-neutral-400 group-hover:text-orange-400">{name}</span>
                                </a>
                            ))}
                        </div>
                    </div>
                )}

                <div className="flex flex-col items-center gap-y-4">
                    <h3 className="text-sm font-semibold uppercase tracking-wider text-neutral-400">Top Languages</h3>
                    <div className="w-full max-w-lg">
                        <div className="mb-3 flex h-3 w-full overflow-hidden rounded-full">
                            {topLanguages.map(({name, percentage}) => (
                                <div
                                    className={`${langColors[name] || 'bg-neutral-500'} transition-all`}
                                    key={name}
                                    style={{width: `${percentage}%`}}
                                    title={`${name} ${percentage}%`}
                                />
                            ))}
                        </div>
                        <div className="flex flex-wrap justify-center gap-x-3 gap-y-1 sm:gap-x-4">
                            {topLanguages.map(({name, percentage}) => (
                                <span className="flex items-center gap-x-1 text-xs text-neutral-300 sm:gap-x-1.5 sm:text-sm" key={name}>
                                    <span className={`inline-block h-2.5 w-2.5 rounded-full ${langColors[name] || 'bg-neutral-500'}`} />
                                    {name}
                                    <span className="text-neutral-500">{percentage}%</span>
                                </span>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </Section>
    );
}
