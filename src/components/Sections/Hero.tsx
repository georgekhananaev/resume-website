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
                <div className="absolute inset-x-0 bottom-6 z-10 flex justify-center">
                    <a
                        aria-label="Scroll down to the about section"
                        className="rounded-full bg-white p-1 ring-white ring-offset-2 ring-offset-gray-700/80 focus:outline-hidden focus:ring-2 sm:p-2"
                        href={`/#${SectionId.About}`}
                        title="Scroll Down">
                        <ChevronDownIcon className="h-5 w-5 bg-transparent sm:h-6 sm:w-6" />
                    </a>
                </div>
            </div>
        </Section>
    );
}
