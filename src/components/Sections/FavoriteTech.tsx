'use client';

import Image from 'next/image';
import {useMemo, useState} from 'react';

import {FavoriteTechItems, SectionId} from '../../data/data';
import Section from '../Layout/Section';

export default function FavoriteTech() {
    const categories = useMemo(() => {
        const cats = ['All', ...new Set(FavoriteTechItems.map(i => i.category))];
        return cats;
    }, []);

    const [active, setActive] = useState('All');

    const filtered = active === 'All' ? FavoriteTechItems : FavoriteTechItems.filter(i => i.category === active);

    return (
        <Section className="bg-neutral-800" sectionId={SectionId.FavoriteTech}>
            <div className="flex flex-col gap-y-6">
                <h2 className="self-center text-2xl font-bold text-white">Technologies I Work With</h2>

                {/* Category filter tabs */}
                <div className="no-scrollbar flex justify-start gap-1.5 overflow-x-auto sm:flex-wrap sm:justify-center">
                    {categories.map(cat => (
                        <button
                            className={`whitespace-nowrap rounded-full px-2.5 py-0.5 text-[11px] font-medium transition-all sm:px-3 sm:py-1 sm:text-xs ${
                                active === cat
                                    ? 'bg-orange-500 text-white'
                                    : 'bg-neutral-700 text-neutral-400 hover:bg-neutral-600 hover:text-neutral-200'
                            }`}
                            key={cat}
                            onClick={() => setActive(cat)}>
                            {cat}
                            {cat !== 'All' && (
                                <span className="ml-1.5 text-[10px] opacity-60">
                                    {FavoriteTechItems.filter(i => i.category === cat).length}
                                </span>
                            )}
                        </button>
                    ))}
                </div>

                {/* Tech grid */}
                <div className="flex flex-wrap justify-center gap-5 sm:gap-6">
                    {filtered.map((item, index) => {
                        const {title, image} = item;
                        return (
                            <div
                                className="flex w-14 flex-col items-center gap-y-1.5 transition-all duration-200 hover:scale-105 sm:w-[72px]"
                                key={`${title}-${index}`}>
                                <div className="relative h-12 w-12 overflow-hidden rounded-lg sm:h-14 sm:w-14">
                                    <Image alt={title} className="rounded-lg" fill src={image} style={{objectFit: 'cover'}} />
                                </div>
                                <span className="text-center text-[9px] leading-tight text-neutral-400 sm:text-[11px]">{title}</span>
                            </div>
                        );
                    })}
                </div>
            </div>
        </Section>
    );
}
