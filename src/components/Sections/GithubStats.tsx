import {ArrowTopRightOnSquareIcon, CalendarDaysIcon, CodeBracketIcon, StarIcon, UserGroupIcon} from '@heroicons/react/24/outline';

import {SectionId} from '../../data/data';

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

            // Parse from sidebar section: most reliable, contains all achievements
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
    Rust: 'bg-indigo-600',
    Go: 'bg-cyan-500',
    'C++': 'bg-pink-500',
    C: 'bg-gray-400',
    'C#': 'bg-purple-500',
    Ruby: 'bg-red-600',
    PHP: 'bg-indigo-400',
    Swift: 'bg-indigo-500',
    Kotlin: 'bg-violet-500',
    Dart: 'bg-sky-400',
    HTML: 'bg-indigo-400',
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
        <section
            className="relative overflow-hidden bg-neutral-950 px-4 py-24 sm:px-6 sm:py-28 lg:px-8 lg:py-32"
            id={SectionId.Github}>
            {/* Grid mesh backdrop — matches Services.tsx / FavoriteTech.tsx */}
            <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 opacity-[0.035]"
                style={{
                    backgroundImage:
                        'linear-gradient(to right, #fff 1px, transparent 1px), linear-gradient(to bottom, #fff 1px, transparent 1px)',
                    backgroundSize: '80px 80px',
                }}
            />

            <div className="relative mx-auto max-w-screen-lg">
                {/* Section header — eyebrow + title + lede, same rhythm as Services */}
                <div className="mb-16 max-w-2xl">
                    <p className="text-sm font-semibold uppercase tracking-widest text-indigo-400">Open source</p>
                    <h2 className="mt-3 text-4xl font-bold leading-tight text-white sm:text-5xl lg:text-6xl">
                        Building in public
                    </h2>
                    <p className="mt-6 text-base leading-relaxed text-neutral-400 sm:text-lg">
                        A live snapshot of my GitHub profile: repositories, stars, languages, and badges earned along the way.
                    </p>
                    <a
                        className="mt-6 inline-flex items-center gap-1.5 text-sm font-semibold text-indigo-400 transition-colors hover:text-indigo-300"
                        href={user.html_url}
                        rel="noopener noreferrer"
                        target="_blank">
                        @{username}
                        <ArrowTopRightOnSquareIcon className="h-4 w-4" />
                    </a>
                </div>

                {/* Stats grid — big monospace numbers in individual editorial cards */}
                <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-4">
                    {stats.map(({label, value, Icon}) => (
                        <div
                            className="group rounded-2xl border border-white/10 bg-white/[0.02] px-5 py-7 transition-all hover:border-indigo-400/30 hover:bg-indigo-400/[0.03] sm:px-7 sm:py-9"
                            key={label}>
                            <Icon className="h-5 w-5 text-indigo-400 transition-colors group-hover:text-indigo-300" />
                            <span className="mt-4 block font-mono text-3xl font-bold tabular-nums text-white sm:text-4xl lg:text-5xl">
                                {value.toLocaleString()}
                            </span>
                            <span className="mt-2 block text-xs font-semibold uppercase tracking-widest text-neutral-500">
                                {label}
                            </span>
                        </div>
                    ))}
                </div>

                {/* Top languages — minimal bar, editorial label */}
                <div className="mt-16 grid grid-cols-1 gap-y-4 sm:grid-cols-[160px_1fr] sm:gap-x-10 sm:gap-y-0">
                    <div className="sm:pt-1">
                        <p className="font-mono text-xs font-bold uppercase tracking-widest text-indigo-400/80 sm:text-sm">
                            Top languages
                        </p>
                    </div>
                    <div>
                        <div className="flex h-2 w-full overflow-hidden rounded-full bg-white/5">
                            {topLanguages.map(({name, percentage}) => (
                                <div
                                    className={`${langColors[name] || 'bg-neutral-500'} transition-all`}
                                    key={name}
                                    style={{width: `${percentage}%`}}
                                    title={`${name} ${percentage}%`}
                                />
                            ))}
                        </div>
                        <div className="mt-4 flex flex-wrap gap-x-5 gap-y-2">
                            {topLanguages.map(({name, percentage}) => (
                                <span className="flex items-center gap-1.5 text-sm text-neutral-300" key={name}>
                                    <span
                                        className={`inline-block h-2 w-2 rounded-full ${langColors[name] || 'bg-neutral-500'}`}
                                    />
                                    {name}
                                    <span className="text-neutral-500">{percentage}%</span>
                                </span>
                            ))}
                        </div>
                    </div>
                </div>

                {achievements.length > 0 && (
                    <div className="mt-14 grid grid-cols-1 gap-y-6 sm:grid-cols-[160px_1fr] sm:gap-x-10 sm:gap-y-0">
                        <div className="sm:pt-1">
                            <p className="font-mono text-xs font-bold uppercase tracking-widest text-indigo-400/80 sm:text-sm">
                                Achievements
                            </p>
                        </div>
                        <div className="flex flex-wrap gap-4 sm:gap-5">
                            {achievements.map(({name, slug, image, tier}) => (
                                <a
                                    className="group relative flex flex-col items-center gap-2 rounded-xl border border-white/5 bg-white/[0.02] p-4 transition-all hover:-translate-y-0.5 hover:border-indigo-400/40 hover:bg-indigo-400/5"
                                    href={`https://github.com/${username}?achievement=${slug}&tab=achievements`}
                                    key={slug}
                                    rel="noopener noreferrer"
                                    target="_blank">
                                    <div className="relative">
                                        { }
                                        <img
                                            alt={`Achievement: ${name}`}
                                            className="h-14 w-14 drop-shadow-lg sm:h-16 sm:w-16"
                                            decoding="async"
                                            loading="lazy"
                                            src={image}
                                        />
                                        {tier && (
                                            <span className="absolute -bottom-1 -right-1 rounded-full bg-indigo-500 px-1.5 py-0.5 text-[10px] font-bold text-white shadow-lg shadow-indigo-500/30">
                                                {tier}
                                            </span>
                                        )}
                                    </div>
                                    <span className="text-xs text-neutral-400 transition-colors group-hover:text-indigo-300">
                                        {name}
                                    </span>
                                </a>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </section>
    );
}
