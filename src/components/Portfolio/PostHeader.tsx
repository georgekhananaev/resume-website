import {BriefcaseIcon, CalendarIcon, ClockIcon, LockClosedIcon, StarIcon, TagIcon} from '@heroicons/react/24/outline';
import Image from 'next/image';
import Link from 'next/link';

import type {PostWithStarsFull} from '../../lib/post-stars';
import GithubIcon from '../Icon/GithubIcon';

const DEFAULT_AVATAR = '/webp/george_khananaev_ws.webp';

/**
 * Guard against avatar URLs whose hostname is not configured in
 * next.config.js remotePatterns. If the URL points at our own site origin,
 * convert it to a relative path so Next.js can serve it directly.
 * Otherwise fall back to the default avatar — we only want external avatars
 * loaded through next/image when they come from known remotePatterns.
 */
function getSafeAvatar(avatar: string | undefined): string {
    if (!avatar) return DEFAULT_AVATAR;
    if (avatar.startsWith('/')) return avatar;
    try {
        const parsed = new URL(avatar);
        const siteUrl = process.env.SITE_URL || 'https://george.khananaev.com';
        const siteHost = new URL(siteUrl).hostname;
        if (parsed.hostname === siteHost) return parsed.pathname;
        return DEFAULT_AVATAR;
    } catch {
        return DEFAULT_AVATAR;
    }
}

export default function PostHeader({post}: {post: PostWithStarsFull}) {
    const published = new Date(post.publishedAt);
    const updated = new Date(post.updatedAt);
    const wasUpdated = updated.getTime() - published.getTime() > 86_400_000;

    return (
        <header className="mx-auto max-w-3xl px-4 pt-32 sm:px-6 sm:pt-40 lg:px-0">
            {post.category && (
                <div className="mb-4 text-center">
                    <span className="inline-block rounded-full border border-indigo-400/40 bg-indigo-400/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-indigo-300">
                        {post.category}
                    </span>
                </div>
            )}

            <h1 className="text-center text-4xl font-bold leading-tight text-white sm:text-5xl lg:text-6xl">
                {post.title}
            </h1>

            {post.subtitle && (
                <p className="mx-auto mt-5 max-w-2xl text-center text-lg font-medium text-neutral-300 sm:text-xl">
                    {post.subtitle}
                </p>
            )}

            <div className="mt-8 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm text-neutral-400">
                <span className="inline-flex items-center gap-1.5">
                    <CalendarIcon className="h-4 w-4" />
                    <time dateTime={published.toISOString()}>
                        {published.toLocaleDateString('en-US', {year: 'numeric', month: 'long', day: 'numeric'})}
                    </time>
                </span>
                {wasUpdated && (
                    <span className="inline-flex items-center gap-1.5 italic">
                        Updated{' '}
                        <time dateTime={updated.toISOString()}>
                            {updated.toLocaleDateString('en-US', {year: 'numeric', month: 'long', day: 'numeric'})}
                        </time>
                    </span>
                )}
                <span className="inline-flex items-center gap-1.5">
                    <ClockIcon className="h-4 w-4" />
                    {post.readingTime} min read
                </span>
                <Link
                    className="group inline-flex items-center gap-1.5 transition-colors hover:text-indigo-300"
                    href="/"
                    rel="author"
                    title="More about George Khananaev">
                    <Image
                        alt=""
                        className="rounded-full ring-1 ring-white/10 transition-colors group-hover:ring-indigo-400/60"
                        height={20}
                        src={getSafeAvatar(post.author.avatar)}
                        width={20}
                    />
                    <span className="text-neutral-400 group-hover:text-indigo-300">Written by</span>
                    <span className="font-semibold text-neutral-200 group-hover:text-indigo-200">{post.author.name}</span>
                </Link>
            </div>

            {post.portfolioType === 'commercial' ? (
                <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
                    {post.clientName && !post.isConfidential ? (
                        post.clientUrl ? (
                            <a
                                className="inline-flex items-center gap-2 rounded-full border border-indigo-400/40 bg-indigo-400/10 px-4 py-2 text-sm font-semibold text-indigo-200 transition-colors hover:border-indigo-400 hover:bg-indigo-400/20"
                                href={post.clientUrl}
                                rel="noopener noreferrer"
                                target="_blank">
                                <BriefcaseIcon className="h-4 w-4" />
                                <span>{post.clientName}</span>
                            </a>
                        ) : (
                            <span className="inline-flex items-center gap-2 rounded-full border border-indigo-400/40 bg-indigo-400/10 px-4 py-2 text-sm font-semibold text-indigo-200">
                                <BriefcaseIcon className="h-4 w-4" />
                                <span>{post.clientName}</span>
                            </span>
                        )
                    ) : (
                        <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-neutral-900 px-4 py-2 text-sm font-semibold text-neutral-300">
                            <LockClosedIcon className="h-4 w-4" />
                            <span>Confidential client</span>
                        </span>
                    )}
                    {post.engagementPeriod && (
                        <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-neutral-900 px-4 py-2 text-sm font-medium text-neutral-300">
                            <CalendarIcon className="h-4 w-4" />
                            <span>{post.engagementPeriod}</span>
                        </span>
                    )}
                    {post.role && (
                        <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-neutral-900 px-4 py-2 text-sm font-medium text-neutral-300">
                            <span>{post.role}</span>
                        </span>
                    )}
                </div>
            ) : (
                (post.githubUrl || typeof post.stars === 'number') && (
                    <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
                        {post.githubUrl && (
                            <a
                                className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-neutral-900 px-4 py-2 text-sm font-semibold text-white transition-colors hover:border-indigo-400/60 hover:bg-neutral-800"
                                href={post.githubUrl}
                                rel="noopener noreferrer"
                                target="_blank">
                                <GithubIcon className="h-4 w-4" />
                                <span>View on GitHub</span>
                            </a>
                        )}
                        {typeof post.stars === 'number' && (
                            <span
                                className="inline-flex items-center gap-1.5 rounded-full border border-indigo-400/30 bg-indigo-400/10 px-4 py-2 text-sm font-semibold text-indigo-300"
                                title={`${post.stars} stars on GitHub`}>
                                <StarIcon className="h-4 w-4" />
                                {post.stars.toLocaleString()} {post.stars === 1 ? 'star' : 'stars'}
                            </span>
                        )}
                    </div>
                )
            )}

            {post.tags.length > 0 && (
                <div className="mt-6 flex flex-wrap items-center justify-center gap-2">
                    <TagIcon aria-hidden="true" className="h-4 w-4 text-neutral-500" />
                    {post.tags.map(tag => (
                        <Link
                            className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-neutral-300 transition-colors hover:border-indigo-400/50 hover:text-indigo-300"
                            href={`/portfolio/tag/${tag}`}
                            key={tag}>
                            #{tag}
                        </Link>
                    ))}
                </div>
            )}
        </header>
    );
}
