import Image from 'next/image';

import {FavoriteTechItems} from '../../data/data';
import type {FavoriteTechItem} from '../../data/dataDef';

/**
 * Editorial tech stack layout. Replaces the old filterable icon grid with a
 * category-grouped list in the same visual language as Services.tsx and
 * ContactCTA.tsx: dark background, subtle grid mesh, typography-forward,
 * indigo-400 accents, monospace category labels on the left.
 *
 * No client-side state (removed the All/category filter). All tools are
 * shown at once, grouped by category in the order they appear in the source.
 */

function groupByCategory(): Array<[string, FavoriteTechItem[]]> {
    const groups = new Map<string, FavoriteTechItem[]>();
    for (const item of FavoriteTechItems) {
        const existing = groups.get(item.category);
        if (existing) {
            existing.push(item);
        } else {
            groups.set(item.category, [item]);
        }
    }
    return Array.from(groups.entries());
}

export default function FavoriteTech() {
    const groups = groupByCategory();

    return (
        <section className="relative bg-neutral-950 px-4 py-24 sm:px-6 sm:py-28 lg:px-8 lg:py-32">
            {/* Grid mesh backdrop — matches Services.tsx */}
            <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 opacity-[0.035]"
                style={{
                    backgroundImage:
                        'linear-gradient(to right, #fff 1px, transparent 1px), linear-gradient(to bottom, #fff 1px, transparent 1px)',
                    backgroundSize: '80px 80px',
                }}
            />

            <div className="relative mx-auto max-w-screen-md">
                <div className="mb-16">
                    <p className="text-sm font-semibold uppercase tracking-widest text-indigo-400">Tech stack</p>
                    <h2 className="mt-3 text-4xl font-bold leading-tight text-white sm:text-5xl lg:text-6xl">
                        Tools I reach for
                    </h2>
                    <p className="mt-6 max-w-xl text-base leading-relaxed text-neutral-400 sm:text-lg">
                        The stack behind every case study in the portfolio, grouped by category.
                    </p>
                </div>

                <div className="space-y-12 sm:space-y-14">
                    {groups.map(([category, items]) => (
                        <div
                            className="grid grid-cols-1 gap-y-4 sm:grid-cols-[160px_1fr] sm:gap-x-10 sm:gap-y-0"
                            key={category}>
                            <div className="sm:pt-2">
                                <p className="font-mono text-xs font-bold uppercase tracking-widest text-indigo-400/80 sm:text-sm">
                                    {category}
                                </p>
                            </div>
                            <div className="flex flex-wrap items-center gap-x-5 gap-y-3">
                                {items.map(({title, image}) => (
                                    <div className="flex items-center gap-2" key={title}>
                                        <div className="relative h-6 w-6 flex-shrink-0 overflow-hidden rounded">
                                            <Image
                                                alt={title}
                                                className="rounded"
                                                fill
                                                loading="lazy"
                                                sizes="24px"
                                                src={image}
                                                style={{objectFit: 'cover'}}
                                            />
                                        </div>
                                        <span className="text-sm text-neutral-300">{title}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
