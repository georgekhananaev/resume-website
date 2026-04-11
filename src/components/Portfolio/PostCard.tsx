import {BriefcaseIcon, ClockIcon, LockClosedIcon, StarIcon} from '@heroicons/react/24/outline';
import {StarIcon as StarIconSolid} from '@heroicons/react/24/solid';
import Image from 'next/image';
import Link from 'next/link';

import type {PostWithStars} from '../../lib/post-stars';
import GithubIcon from '../Icon/GithubIcon';

export default function PostCard({post, priority = false}: {post: PostWithStars; priority?: boolean}) {
    const href = `/portfolio/${post.slug}`;
    const publishedDate = new Date(post.publishedAt).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
    });

    const isCommercial = post.portfolioType === 'commercial';

    // What renders in the top-right corner of the thumbnail.
    // Public posts get a clickable GitHub pill. Commercial posts get a
    // non-clickable client-or-confidential label.
    const topRightBadge = (() => {
        if (isCommercial) {
            if (post.isConfidential || !post.clientName) {
                return (
                    <span className="absolute right-3 top-3 z-20 inline-flex items-center gap-1.5 rounded-full border border-white/20 bg-neutral-950/80 px-3 py-1 text-xs font-semibold text-neutral-300 backdrop-blur">
                        <LockClosedIcon className="h-3.5 w-3.5" />
                        <span>Private</span>
                    </span>
                );
            }
            return (
                <span className="absolute right-3 top-3 z-20 inline-flex items-center gap-1.5 rounded-full border border-indigo-400/40 bg-indigo-400/10 px-3 py-1 text-xs font-semibold text-indigo-200 backdrop-blur">
                    <BriefcaseIcon className="h-3.5 w-3.5" />
                    <span>{post.clientName}</span>
                </span>
            );
        }
        if (post.githubUrl) {
            return (
                <a
                    aria-label={`View ${post.title} on GitHub`}
                    className="absolute right-3 top-3 z-20 inline-flex items-center gap-1.5 rounded-full border border-white/20 bg-neutral-950/80 px-3 py-1 text-xs font-semibold text-white backdrop-blur transition-colors hover:border-indigo-400/60 hover:bg-neutral-950"
                    href={post.githubUrl}
                    rel="noopener noreferrer"
                    target="_blank">
                    <GithubIcon className="h-3.5 w-3.5" />
                    <span>GitHub</span>
                </a>
            );
        }
        return null;
    })();

    return (
        <article className="group relative flex flex-col overflow-hidden rounded-2xl bg-neutral-900 ring-1 ring-white/10 transition-all hover:-translate-y-1 hover:ring-indigo-400/50 hover:shadow-lg hover:shadow-indigo-500/10">
            <Link aria-label={post.title} className="absolute inset-0 z-10" href={href}>
                <span className="sr-only">{post.title}</span>
            </Link>

            <div className="relative aspect-square overflow-hidden bg-neutral-950">
                <Image
                    alt={post.thumbnail.alt}
                    className="object-contain p-4 transition-transform duration-500 group-hover:scale-105"
                    fill
                    priority={priority}
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    src={post.thumbnail.url}
                />
                {post.featured && (
                    <span
                        aria-label="Featured post"
                        className="absolute left-3 top-3 z-20 inline-flex items-center gap-1.5 rounded-full border border-indigo-300/50 bg-indigo-500/90 px-3 py-1 text-xs font-bold uppercase tracking-widest text-white shadow-lg shadow-indigo-500/30 backdrop-blur">
                        <StarIconSolid className="h-3.5 w-3.5" />
                        <span>Featured</span>
                    </span>
                )}
                {topRightBadge}
            </div>

            <div className="flex flex-1 flex-col gap-3 p-6">
                <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-neutral-400">
                    <time dateTime={new Date(post.publishedAt).toISOString()}>{publishedDate}</time>
                    <span aria-hidden="true">·</span>
                    <span className="inline-flex items-center gap-1">
                        <ClockIcon className="h-3.5 w-3.5" />
                        {post.readingTime} min
                    </span>
                    {!isCommercial && typeof post.stars === 'number' && (
                        <>
                            <span aria-hidden="true">·</span>
                            <span className="inline-flex items-center gap-1 text-indigo-300" title={`${post.stars} stars on GitHub`}>
                                <StarIcon className="h-3.5 w-3.5" />
                                {post.stars.toLocaleString()}
                            </span>
                        </>
                    )}
                    {isCommercial && post.engagementPeriod && (
                        <>
                            <span aria-hidden="true">·</span>
                            <span className="inline-flex items-center gap-1 text-indigo-300">
                                <BriefcaseIcon className="h-3.5 w-3.5" />
                                {post.engagementPeriod}
                            </span>
                        </>
                    )}
                </div>
                <h3 className="text-xl font-bold leading-tight text-white transition-colors group-hover:text-indigo-400">
                    {post.title}
                </h3>
                {post.subtitle && <p className="text-sm italic text-neutral-400">{post.subtitle}</p>}
                <p className="line-clamp-3 text-sm leading-relaxed text-neutral-300">{post.excerpt}</p>
                {post.tags.length > 0 && (
                    <div className="mt-auto flex flex-wrap gap-2 pt-3">
                        {post.tags.slice(0, 4).map(tag => (
                            <span
                                className="rounded-full border border-indigo-400/20 bg-indigo-400/5 px-2.5 py-0.5 text-[11px] font-medium text-indigo-300"
                                key={tag}>
                                {tag}
                            </span>
                        ))}
                    </div>
                )}
            </div>
        </article>
    );
}
