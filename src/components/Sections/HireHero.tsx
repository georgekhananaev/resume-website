import {ArrowRightIcon, DocumentArrowDownIcon} from '@heroicons/react/24/outline';
import Link from 'next/link';

import {hirePitch} from '../../data/data';
import GridBackground from '../GridBackground';

export default function HireHero() {
    return (
        <section className="relative overflow-hidden bg-neutral-950 px-4 py-24 sm:px-6 sm:py-32 lg:px-8 lg:py-40">
            <GridBackground />
            <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0"
                style={{background: 'radial-gradient(ellipse at center, transparent 0%, rgba(10,10,10,0.5) 60%, rgba(10,10,10,0.98) 100%)'}}
            />
            <div className="relative z-10 mx-auto max-w-screen-md text-center">
                <div className="mb-6 inline-block rounded-full border border-indigo-400/40 bg-indigo-400/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-indigo-300">
                    Open to new projects
                </div>
                <h1 className="text-4xl font-bold text-white sm:text-6xl lg:text-7xl">
                    {hirePitch.headline}
                </h1>
                <p className="mt-5 text-lg font-medium text-indigo-400 sm:text-xl">
                    {hirePitch.tagline}
                </p>
                <p className="mt-6 text-base leading-relaxed text-stone-300 sm:text-lg">
                    {hirePitch.summary}
                </p>
                <p className="mt-3 text-sm italic text-stone-400 sm:text-base">
                    {hirePitch.availability}
                </p>
                <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
                    <Link
                        className="inline-flex items-center gap-x-2 rounded-full bg-indigo-500 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-500/30 transition-colors hover:bg-indigo-400 sm:text-base"
                        href="/contact">
                        Start a conversation
                        <ArrowRightIcon className="h-5 w-5" />
                    </Link>
                    <a
                        className="inline-flex items-center gap-x-2 rounded-full border-2 border-white/60 px-6 py-3 text-sm font-semibold text-white transition-colors hover:border-white hover:bg-white/10 sm:text-base"
                        href="/api/resume">
                        Download Resume
                        <DocumentArrowDownIcon className="h-5 w-5" />
                    </a>
                </div>
            </div>
        </section>
    );
}
