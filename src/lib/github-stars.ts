import 'server-only';

/**
 * Fetch star counts for a batch of GitHub repo URLs.
 *
 * - Uses GITHUB_TOKEN if set (higher rate limits, required for private repos).
 * - Caches each response with Next.js ISR for 1h so repeated renders of the
 *   portfolio don't hammer the GitHub API.
 * - Returns a map keyed by the original URL. URLs that fail silently return
 *   undefined and are simply omitted from the map.
 */
export async function getStarCounts(githubUrls: (string | undefined)[]): Promise<Record<string, number>> {
    const token = process.env.GITHUB_TOKEN;
    const headers: HeadersInit = token
        ? {Authorization: `Bearer ${token}`, Accept: 'application/vnd.github.v3+json'}
        : {Accept: 'application/vnd.github.v3+json'};

    const stars: Record<string, number> = {};
    const uniqueUrls = Array.from(new Set(githubUrls.filter((u): u is string => Boolean(u))));

    await Promise.all(
        uniqueUrls.map(async url => {
            const match = url.match(/github\.com\/([^/]+)\/([^/?#]+)/);
            if (!match) return;
            const [, owner, repoRaw] = match;
            const repo = repoRaw.replace(/\.git$/, '');
            try {
                const res = await fetch(`https://api.github.com/repos/${owner}/${repo}`, {
                    headers,
                    next: {revalidate: 3600},
                });
                if (!res.ok) return;
                const data = (await res.json()) as {stargazers_count?: number};
                if (typeof data.stargazers_count === 'number') {
                    stars[url] = data.stargazers_count;
                }
            } catch {
                // Swallow network errors — stars are cosmetic, not load-bearing.
            }
        }),
    );

    return stars;
}

/**
 * Convenience: fetch a single URL's star count.
 */
export async function getStarCount(githubUrl: string | undefined): Promise<number | undefined> {
    if (!githubUrl) return undefined;
    const map = await getStarCounts([githubUrl]);
    return map[githubUrl];
}
