'use client';

import {ArrowRightIcon, ChevronDownIcon, DocumentArrowDownIcon} from '@heroicons/react/24/outline';

import {heroData, SectionId} from '../../data/data';
import GridBackground from '../GridBackground';
import Section from '../Layout/Section';
import Socials from '../Socials';

export default function Hero() {
    const {name, description} = heroData;

    return (
        <Section noPadding sectionId={SectionId.Hero}>
            <div className="relative flex h-screen w-full items-center justify-center overflow-hidden bg-neutral-950">
                <GridBackground />
                <div
                    aria-hidden="true"
                    className="pointer-events-none absolute inset-0"
                    style={{background: 'radial-gradient(ellipse at center, transparent 0%, rgba(10,10,10,0.5) 60%, rgba(10,10,10,0.98) 100%)'}}
                />
                <div className="relative z-10 mx-auto max-w-screen-md px-4 text-center sm:px-6">
                    <div className="mb-6 inline-block rounded-full border border-indigo-400/40 bg-indigo-400/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-indigo-300">
                        Senior Full Stack Developer · Bangkok
                    </div>
                    <h1 className="text-4xl font-bold text-white sm:text-6xl lg:text-7xl">{name}</h1>
                    {description}
                    <div className="mt-8 flex justify-center gap-x-4 text-neutral-100">
                        <Socials />
                    </div>
                    <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
                        <a
                            className="inline-flex items-center gap-x-2 rounded-full bg-indigo-500 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-500/30 transition-colors hover:bg-indigo-400 sm:text-base"
                            href="/contact">
                            Get in touch
                            <ArrowRightIcon className="h-5 w-5" />
                        </a>
                        <a
                            className="inline-flex items-center gap-x-2 rounded-full border-2 border-white/60 px-6 py-3 text-sm font-semibold text-white transition-colors hover:border-white hover:bg-white/10 sm:text-base"
                            href="/api/resume">
                            Download Resume
                            <DocumentArrowDownIcon className="h-5 w-5" />
                        </a>
                    </div>
                </div>
                <div className="absolute inset-x-0 bottom-8 z-10 flex justify-center sm:bottom-10">
                    <a
                        aria-label="Scroll down to the about section"
                        className="group inline-flex flex-col items-center gap-2 rounded-xl px-4 py-2 focus:outline-hidden focus-visible:ring-2 focus-visible:ring-indigo-400 focus-visible:ring-offset-4 focus-visible:ring-offset-neutral-950"
                        href={`/#${SectionId.About}`}
                        title="Scroll to About">
                        <span className="text-[10px] font-semibold uppercase tracking-[0.3em] text-indigo-400/70 transition-colors group-hover:text-indigo-300">
                            Scroll
                        </span>
                        {/* Three stacked chevrons blinking in sequence (classic iOS-style
                            scroll hint). Staggered animation-delay gives the illusion of
                            a "download" cascade. motion-reduce respects user preference. */}
                        <span className="flex -space-y-[10px] flex-col items-center motion-reduce:[&_svg]:animate-none">
                            <ChevronDownIcon
                                className="h-5 w-5 animate-chevron-blink text-indigo-400 transition-colors group-hover:text-indigo-300"
                                strokeWidth={2.5}
                                style={{animationDelay: '0s'}}
                            />
                            <ChevronDownIcon
                                className="h-5 w-5 animate-chevron-blink text-indigo-400 transition-colors group-hover:text-indigo-300"
                                strokeWidth={2.5}
                                style={{animationDelay: '0.2s'}}
                            />
                            <ChevronDownIcon
                                className="h-5 w-5 animate-chevron-blink text-indigo-400 transition-colors group-hover:text-indigo-300"
                                strokeWidth={2.5}
                                style={{animationDelay: '0.4s'}}
                            />
                        </span>
                    </a>
                </div>
            </div>
        </Section>
    );
}
