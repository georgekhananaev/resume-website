'use client';

import clsx from 'clsx';
import {useMemo, useState} from 'react';

import type {PostWithStars} from '../../lib/post-stars';
import PostRow from './PostRow';

type Tab = 'commercial' | 'public';

interface PortfolioToggleSectionProps {
    title: string;
    subtitle: string;
    /** Small uppercase label rendered above the title in the editorial header. */
    eyebrow?: string;
    commercial: PostWithStars[];
    publicPosts: PostWithStars[];
    /** Which tab to show first. Falls back to the other tab if the preferred one is empty. */
    defaultTab?: Tab;
    /** Whether to show an RSS link in the header corner. */
    showRssLink?: boolean;
    /** Whether to render a top border (used for non-first sections to visually separate them). */
    bordered?: boolean;
}

interface TabButtonProps {
    active: boolean;
    label: string;
    count: number;
    onClick: () => void;
}

function TabButton({active, label, count, onClick}: TabButtonProps) {
    return (
        <button
            className={clsx(
                'inline-flex items-center gap-1.5 rounded-full px-4 py-1.5 text-xs font-semibold uppercase tracking-widest transition-colors',
                active
                    ? 'bg-indigo-500 text-white shadow-md shadow-indigo-500/20'
                    : 'text-neutral-400 hover:text-white',
            )}
            onClick={onClick}
            type="button">
            {label}
            <span
                className={clsx(
                    'rounded-full px-1.5 py-0.5 text-[9px] font-bold leading-none',
                    active ? 'bg-white/20 text-white' : 'bg-white/5 text-neutral-500',
                )}>
                {count}
            </span>
        </button>
    );
}

export default function PortfolioToggleSection({
    title,
    subtitle,
    eyebrow,
    commercial,
    publicPosts,
    defaultTab = 'commercial',
    showRssLink = false,
    bordered = false,
}: PortfolioToggleSectionProps) {
    const hasCommercial = commercial.length > 0;
    const hasPublic = publicPosts.length > 0;

    // Resolve the initial tab: honour defaultTab if that category has items,
    // otherwise fall back to whichever tab does.
    const initialTab: Tab = useMemo(() => {
        if (defaultTab === 'commercial' && hasCommercial) return 'commercial';
        if (defaultTab === 'public' && hasPublic) return 'public';
        if (hasCommercial) return 'commercial';
        return 'public';
    }, [defaultTab, hasCommercial, hasPublic]);

    const [tab, setTab] = useState<Tab>(initialTab);

    const visible = tab === 'commercial' ? commercial : publicPosts;

    if (!hasCommercial && !hasPublic) return null;

    return (
        <section
            className={clsx(
                'relative overflow-hidden bg-neutral-950 px-4 py-20 sm:px-6 sm:py-24 lg:px-8 lg:py-28',
                bordered && 'border-t border-white/5',
            )}>
            {/* Grid mesh backdrop — matches Services / FavoriteTech / PageHero */}
            <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 opacity-[0.035]"
                style={{
                    backgroundImage:
                        'linear-gradient(to right, #fff 1px, transparent 1px), linear-gradient(to bottom, #fff 1px, transparent 1px)',
                    backgroundSize: '80px 80px',
                }}
            />

            <div className="relative mx-auto max-w-screen-xl">
                <div className="mb-10 flex flex-wrap items-end justify-between gap-6 sm:mb-12">
                    <div className="max-w-2xl">
                        {eyebrow && (
                            <p className="text-sm font-semibold uppercase tracking-widest text-indigo-400">
                                {eyebrow}
                            </p>
                        )}
                        <h2 className="mt-2 text-3xl font-bold leading-tight text-white sm:text-4xl lg:text-5xl">
                            {title}
                        </h2>
                        <p className="mt-4 text-base leading-relaxed text-neutral-400 sm:text-lg">{subtitle}</p>
                    </div>
                    <div className="flex items-center gap-3">
                        <div
                            aria-label={`Filter ${title.toLowerCase()}`}
                            className="inline-flex items-center gap-1 rounded-full border border-white/10 bg-neutral-900/80 p-1 backdrop-blur"
                            role="group">
                            {hasCommercial && (
                                <TabButton
                                    active={tab === 'commercial'}
                                    count={commercial.length}
                                    label="Commercial"
                                    onClick={() => setTab('commercial')}
                                />
                            )}
                            {hasPublic && (
                                <TabButton
                                    active={tab === 'public'}
                                    count={publicPosts.length}
                                    label="Public"
                                    onClick={() => setTab('public')}
                                />
                            )}
                        </div>
                        {showRssLink && (
                            <a
                                className="shrink-0 rounded-full border border-white/10 bg-neutral-900/80 px-3 py-1.5 text-xs font-semibold text-neutral-300 transition-colors hover:border-indigo-400/40 hover:text-indigo-300"
                                href="/portfolio/rss.xml">
                                RSS
                            </a>
                        )}
                    </div>
                </div>

                {visible.length > 0 ? (
                    <div
                        className="flex flex-col gap-4"
                        // Re-mount on tab change so the stagger animation runs fresh
                        // every time the user switches between Commercial and Public.
                        key={tab}>
                        {visible.map((post, idx) => (
                            <div
                                className="animate-fade-in-up motion-reduce:animate-none"
                                key={post.slug}
                                style={{animationDelay: `${Math.min(idx * 55, 440)}ms`}}>
                                <PostRow post={post} priority={idx < 3} />
                            </div>
                        ))}
                    </div>
                ) : (
                    <p className="py-8 text-center text-sm text-neutral-500">
                        No {tab === 'commercial' ? 'commercial' : 'public'} posts in this section yet.
                    </p>
                )}
            </div>
        </section>
    );
}
