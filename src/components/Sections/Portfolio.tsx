'use client';

import {ArrowTopRightOnSquareIcon, StarIcon} from '@heroicons/react/24/outline';
import clsx from 'clsx';
import Image from 'next/image';
import {MouseEvent, useCallback, useEffect, useRef, useState} from 'react';

import {isMobile} from '../../config';
import {portfolioItems, SectionId} from '../../data/data';
import {PortfolioItem} from '../../data/dataDef';
import useDetectOutsideClick from '../../hooks/useDetectOutsideClick';
import CardBackground from '../CardBackground';
import Section from '../Layout/Section';

export default function Portfolio({starCounts = {}}: {starCounts?: Record<string, number>}) {
    return (
        <Section className="relative overflow-hidden bg-neutral-800" sectionId={SectionId.Portfolio}>
            {/* Floating background orbs */}
            <div className="pointer-events-none absolute inset-0">
                <div className="absolute left-[10%] top-[20%] h-64 w-64 rounded-full bg-orange-500/5 blur-3xl" style={{animation: 'orb-float-1 12s ease-in-out infinite'}} />
                <div className="absolute right-[15%] top-[50%] h-48 w-48 rounded-full bg-blue-500/5 blur-3xl" style={{animation: 'orb-float-2 15s ease-in-out infinite'}} />
                <div className="absolute bottom-[10%] left-[40%] h-56 w-56 rounded-full bg-purple-500/5 blur-3xl" style={{animation: 'orb-float-3 18s ease-in-out infinite'}} />
            </div>

            <div className="relative flex flex-col gap-y-8">
                <div className="flex flex-col items-center gap-y-2">
                    <h2 className="text-2xl font-bold text-white">Check out some of my public work</h2>
                    <p className="max-w-2xl text-center text-sm text-neutral-400">
                        Beyond open source, I design and build multi-tenant enterprise applications end to end,
                        from architecture to deployment. My private work includes AI-driven platforms, full-stack
                        travel systems, e-commerce automation engines, and real-time data pipelines for corporations.
                    </p>
                </div>
                <div className="mb-6 w-full columns-1 sm:columns-2 md:columns-3 lg:columns-4">
                    {portfolioItems.map((item, index) => {
                        const {title, image, url} = item;
                        const repoMatch = url.match(/github\.com\/[^/]+\/([^/]+)/);
                        const stars = repoMatch ? (starCounts[repoMatch[1]] ?? item.stars) : item.stars;
                        return (
                            <div className="pb-4" key={`${title}-${index}`}>
                                <div className="portfolio-card relative h-full w-full overflow-hidden">
                                    <CardBackground seed={index} />
                                    <Image alt={`${title} project preview`} className="relative rounded-xl" loading="lazy" src={image} />
                                    {stars !== undefined && stars > 0 && (
                                        <span className="absolute left-2 top-2 z-[5] flex items-center gap-1 rounded-full bg-black/70 px-2 py-0.5 text-xs font-medium text-yellow-400 backdrop-blur-sm">
                                            <StarIcon className="h-3 w-3" />
                                            {stars}
                                        </span>
                                    )}
                                    <ItemOverlay item={item} />
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </Section>
    );
}

function ItemOverlay({item: {url, title, description}}: {item: PortfolioItem}) {
    const [mobile, setMobile] = useState(false);
    const [showOverlay, setShowOverlay] = useState(false);
    const linkRef = useRef<HTMLAnchorElement>(null);

    useEffect(() => {
        if (isMobile) {
            setMobile(true);
        }
    }, []);
    useDetectOutsideClick(linkRef, () => setShowOverlay(false));

    const handleItemClick = useCallback(
        (event: MouseEvent<HTMLElement>) => {
            if (mobile && !showOverlay) {
                event.preventDefault();
                setShowOverlay(!showOverlay);
            }
        },
        [mobile, showOverlay],
    );

    return (
        <a
            className={clsx(
                'absolute inset-0 z-10 rounded-xl custom-h-full w-full bg-gradient-to-t from-black/90 via-gray-900/80 to-gray-900/60 transition-all duration-300',
                {'opacity-0 hover:opacity-100': !mobile},
                showOverlay ? 'opacity-100' : 'opacity-0',
            )}
            href={url}
            onClick={handleItemClick}
            ref={linkRef}
            rel="noopener noreferrer"
            target="_blank">
            <div className="relative h-full w-full p-4">
                <div className="portfolio-scroll flex h-full w-full flex-col gap-y-2 overflow-y-auto">
                    <h3 className="text-center text-xl font-bold text-white sm:text-base">{title}</h3>
                    <p className="text-lg leading-relaxed text-stone-200 sm:text-sm">{description}</p>
                </div>
                <ArrowTopRightOnSquareIcon
                    className="absolute bottom-2 right-2 h-4 w-4 shrink-0 text-orange-400" />
            </div>
        </a>
    );
}
