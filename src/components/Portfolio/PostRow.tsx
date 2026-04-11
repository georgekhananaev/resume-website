import {BriefcaseIcon, CalendarIcon, ClockIcon, LockClosedIcon, StarIcon} from '@heroicons/react/24/outline';
import {StarIcon as StarIconSolid} from '@heroicons/react/24/solid';
import Image from 'next/image';
import Link from 'next/link';

import type {PostWithStars} from '../../lib/post-stars';
import GithubIcon from '../Icon/GithubIcon';

/**
 * GitHub-repository-style single-row layout for portfolio posts. One post
 * per row with a small square thumbnail on the left, title + subtitle +
 * excerpt in the middle, action badge on the right, and a meta strip at
 * the bottom showing tags · stars · date · reading time.
 *
 * Used by /portfolio and /portfolio/tag/[tag]. The smaller card variant
 * (`PostCard`) is still used by RelatedPosts where a 3-column grid fits
 * the context better.
 */
export default function PostRow({post, priority = false}: {post: PostWithStars; priority?: boolean}) {
    const href = `/portfolio/${post.slug}`;
    const publishedDate = new Date(post.publishedAt).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
    });

    const isCommercial = post.portfolioType === 'commercial';

    return (
        <article className="group relative flex gap-4 rounded-2xl border border-white/10 bg-neutral-900/40 p-5 transition-all hover:border-indigo-400/40 hover:bg-neutral-900/70 hover:shadow-lg hover:shadow-indigo-500/5 sm:gap-6 sm:p-6">
            <Link aria-label={post.title} className="absolute inset-0 z-10 rounded-2xl" href={href}>
                <span className="sr-only">Read {post.title}</span>
            </Link>

            {/* Left: square thumbnail (hidden on xs to save horizontal room) */}
            <div className="relative hidden h-20 w-20 shrink-0 overflow-hidden rounded-xl bg-neutral-950 ring-1 ring-white/10 transition-transform duration-500 group-hover:scale-[1.03] sm:block sm:h-24 sm:w-24">
                <Image
                    alt={post.thumbnail.alt}
                    className="object-contain p-3"
                    fill
                    priority={priority}
                    sizes="96px"
                    src={post.thumbnail.url}
                />
            </div>

            {/* Right: content column */}
            <div className="min-w-0 flex-1">
                {/* Top row: eyebrow badges (left) + action badge (right) */}
                <div className="flex flex-wrap items-start justify-between gap-3">
                    <div className="flex flex-wrap items-center gap-2">
                        {post.featured && (
                            <span
                                aria-label="Featured"
                                className="inline-flex items-center gap-1 rounded-full border border-indigo-300/50 bg-indigo-500/15 px-2 py-0.5 text-[10px] font-bold uppercase tracking-widest text-indigo-200">
                                <StarIconSolid className="h-3 w-3" />
                                Featured
                            </span>
                        )}
                        {post.category && (
                            <span className="font-mono text-[10px] font-bold uppercase tracking-widest text-indigo-400/80 sm:text-xs">
                                {post.category}
                            </span>
                        )}
                    </div>

                    {/* Right badge: Commercial = client or Private, Public = GitHub link */}
                    <div className="relative z-20 flex shrink-0 items-center">
                        {isCommercial ? (
                            post.isConfidential || !post.clientName ? (
                                <span className="inline-flex items-center gap-1.5 rounded-full border border-white/15 bg-neutral-950/80 px-3 py-1 text-xs font-semibold text-neutral-300">
                                    <LockClosedIcon className="h-3.5 w-3.5" />
                                    Private
                                </span>
                            ) : (
                                <span className="inline-flex items-center gap-1.5 rounded-full border border-indigo-400/40 bg-indigo-400/10 px-3 py-1 text-xs font-semibold text-indigo-200">
                                    <BriefcaseIcon className="h-3.5 w-3.5" />
                                    <span className="truncate max-w-[140px]">{post.clientName}</span>
                                </span>
                            )
                        ) : (
                            post.githubUrl && (
                                <a
                                    aria-label={`View ${post.title} on GitHub`}
                                    className="inline-flex items-center gap-1.5 rounded-full border border-white/15 bg-neutral-950 px-3 py-1 text-xs font-semibold text-white transition-colors hover:border-indigo-400/60 hover:bg-neutral-900"
                                    href={post.githubUrl}
                                    rel="noopener noreferrer"
                                    target="_blank">
                                    <GithubIcon className="h-3.5 w-3.5" />
                                    GitHub
                                </a>
                            )
                        )}
                    </div>
                </div>

                {/* Title + subtitle */}
                <h3 className="mt-2 text-lg font-bold leading-tight text-white transition-colors group-hover:text-indigo-300 sm:text-xl">
                    {post.title}
                </h3>
                {post.subtitle && (
                    <p className="mt-1 text-sm italic text-neutral-400 sm:text-base">{post.subtitle}</p>
                )}

                {/* Excerpt */}
                <p className="mt-3 line-clamp-2 text-sm leading-relaxed text-neutral-300 sm:line-clamp-3">
                    {post.excerpt}
                </p>

                {/* Tag chips — own row so they can use the full width */}
                {post.tags.length > 0 && (
                    <div className="mt-4 flex flex-wrap gap-1.5">
                        {post.tags.map(tag => (
                            <span
                                className="rounded-full border border-indigo-400/20 bg-indigo-400/5 px-2 py-0.5 text-[11px] font-medium text-indigo-300"
                                key={tag}>
                                {tag}
                            </span>
                        ))}
                    </div>
                )}

                {/* Meta strip — left-aligned counts, right-anchored date so the
                    date column lines up visually across every row. */}
                <div className="mt-3 flex flex-wrap items-center justify-between gap-x-4 gap-y-2 text-xs text-neutral-400">
                    <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
                        {!isCommercial && typeof post.stars === 'number' && (
                            <span className="inline-flex items-center gap-1.5 text-neutral-300" title={`${post.stars} stars on GitHub`}>
                                <StarIcon className="h-3.5 w-3.5 text-indigo-400" />
                                {post.stars.toLocaleString()}
                            </span>
                        )}

                        {isCommercial && post.engagementPeriod && (
                            <span className="inline-flex items-center gap-1.5 text-indigo-300">
                                <BriefcaseIcon className="h-3.5 w-3.5" />
                                {post.engagementPeriod}
                            </span>
                        )}

                        <span className="inline-flex items-center gap-1.5">
                            <ClockIcon className="h-3.5 w-3.5" />
                            {post.readingTime} min
                        </span>
                    </div>

                    <span className="inline-flex shrink-0 items-center gap-1.5 tabular-nums">
                        <CalendarIcon className="h-3.5 w-3.5" />
                        <time dateTime={new Date(post.publishedAt).toISOString()}>{publishedDate}</time>
                    </span>
                </div>
            </div>
        </article>
    );
}
