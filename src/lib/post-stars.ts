import 'server-only';

import type {Post, PostSummary} from '../types/post';
import {getStarCounts} from './github-stars';

/**
 * A post summary decorated with its live GitHub star count. Populated once
 * per page render (ISR-cached 1h upstream) and passed down to cards.
 */
export type PostWithStars = PostSummary & {stars?: number};

/**
 * Full post (with body) decorated with star count.
 */
export type PostWithStarsFull = Post & {stars?: number};

/**
 * Decorate a list of posts with star counts, one GitHub API call per unique repo.
 */
export async function enrichWithStars<T extends {githubUrl?: string}>(posts: T[]): Promise<(T & {stars?: number})[]> {
    const urls = posts.map(p => p.githubUrl);
    const starMap = await getStarCounts(urls);
    return posts.map(p => ({
        ...p,
        stars: p.githubUrl ? starMap[p.githubUrl] : undefined,
    }));
}
