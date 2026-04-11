import {ArrowUpIcon} from '@heroicons/react/24/outline';
import Image from 'next/image';
import Link from 'next/link';

import {SectionId} from '../../data/data';
import {APP_VERSION} from '../../lib/version';
import HealthIndicator from '../HealthIndicator';
import Socials from '../Socials';

/**
 * Multi-column editorial footer. Matches the site's dark indigo design
 * language (neutral-950 + grid mesh + indigo accents) used on /work-with-me,
 * /portfolio, and the reworked GithubStats section.
 */
export default function Footer() {
    const year = new Date().getFullYear();

    return (
        <footer className="relative overflow-hidden border-t border-white/5 bg-neutral-950">
            {/* Grid mesh backdrop — same pattern used in Services / FavoriteTech / GithubStats */}
            <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 opacity-[0.035]"
                style={{
                    backgroundImage:
                        'linear-gradient(to right, #fff 1px, transparent 1px), linear-gradient(to bottom, #fff 1px, transparent 1px)',
                    backgroundSize: '80px 80px',
                }}
            />

            <div className="relative mx-auto max-w-screen-xl px-4 pb-10 pt-20 sm:px-6 sm:pb-12 sm:pt-24 lg:px-8">
                <div className="grid grid-cols-1 gap-12 md:grid-cols-12 md:gap-10">
                    {/* Brand column */}
                    <div className="md:col-span-5">
                        <Link
                            aria-label="George Khananaev, home"
                            className="group inline-flex items-center gap-3 text-white"
                            href="/">
                            <span className="relative block h-11 w-11 shrink-0 overflow-hidden rounded-full shadow-lg shadow-indigo-500/20 ring-2 ring-indigo-400/40 transition-all group-hover:ring-indigo-400">
                                <Image
                                    alt="George Khananaev"
                                    className="h-full w-full object-cover"
                                    height={1280}
                                    src="/webp/george_khananaev_ws.webp"
                                    style={{objectPosition: 'center top'}}
                                    width={1129}
                                />
                            </span>
                            <span className="flex flex-col leading-tight">
                                <span className="text-base font-bold tracking-tight">George Khananaev</span>
                                <span className="text-xs text-neutral-400">Senior Full Stack Developer</span>
                            </span>
                        </Link>
                        <p className="mt-6 max-w-sm text-sm leading-relaxed text-neutral-400">
                            Head of Development &amp; IT Infrastructure at{' '}
                            <a
                                className="text-neutral-300 transition-colors hover:text-indigo-300"
                                href="https://moonholidays.co.th"
                                rel="noopener noreferrer"
                                target="_blank">
                                Moon Holidays
                            </a>
                            , Bangkok. Available for senior engineering, architecture, and fractional CTO engagements.
                        </p>
                        <div className="mt-6 flex items-center gap-3 text-neutral-400">
                            <Socials />
                        </div>
                    </div>

                    {/* Explore column */}
                    <div className="md:col-span-3">
                        <p className="font-mono text-xs font-bold uppercase tracking-widest text-indigo-400/80">
                            Explore
                        </p>
                        <ul className="mt-5 space-y-3 text-sm">
                            <li>
                                <Link className="text-neutral-300 transition-colors hover:text-indigo-300" href="/">
                                    Home
                                </Link>
                            </li>
                            <li>
                                <Link
                                    className="text-neutral-300 transition-colors hover:text-indigo-300"
                                    href="/portfolio">
                                    Portfolio
                                </Link>
                            </li>
                            <li>
                                <Link
                                    className="text-neutral-300 transition-colors hover:text-indigo-300"
                                    href="/work-with-me">
                                    Work with me
                                </Link>
                            </li>
                            <li>
                                <Link
                                    className="text-neutral-300 transition-colors hover:text-indigo-300"
                                    href="/contact">
                                    Contact
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Resources column */}
                    <div className="md:col-span-4">
                        <p className="font-mono text-xs font-bold uppercase tracking-widest text-indigo-400/80">
                            Resources
                        </p>
                        <ul className="mt-5 space-y-3 text-sm">
                            <li>
                                <a
                                    className="text-neutral-300 transition-colors hover:text-indigo-300"
                                    href="/api/resume">
                                    Download resume (PDF)
                                </a>
                            </li>
                            <li>
                                <Link
                                    className="text-neutral-300 transition-colors hover:text-indigo-300"
                                    href="/portfolio/rss.xml">
                                    Portfolio RSS feed
                                </Link>
                            </li>
                            <li>
                                <a
                                    className="text-neutral-300 transition-colors hover:text-indigo-300"
                                    href="/llms.txt">
                                    llms.txt
                                </a>
                            </li>
                            <li>
                                <a
                                    className="text-neutral-300 transition-colors hover:text-indigo-300"
                                    href="https://github.com/georgekhananaev/resume-website"
                                    rel="noopener noreferrer"
                                    target="_blank">
                                    Fork this site
                                </a>
                            </li>
                        </ul>
                    </div>
                </div>

                {/* Bottom bar */}
                <div className="mt-16 flex flex-col gap-4 border-t border-white/5 pt-8 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                        <p className="text-xs text-neutral-500">
                            &copy; {year} George Khananaev. All rights reserved.
                        </p>
                        <a
                            aria-label={`View health check — running v${APP_VERSION}`}
                            className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-2 py-0.5 font-mono text-[10px] font-semibold text-neutral-400 transition-colors hover:border-indigo-400/40 hover:text-indigo-300"
                            href="/api/health"
                            rel="noopener"
                            target="_blank"
                            title="Deployed version — click for health check">
                            <HealthIndicator />
                            v{APP_VERSION}
                        </a>
                    </div>
                    <div className="flex items-center gap-5">
                        <span className="text-xs text-neutral-500">
                            Built with Next.js, Tailwind, and MongoDB
                        </span>
                        <a
                            aria-label="Back to top"
                            className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-semibold text-neutral-300 transition-all hover:border-indigo-400/50 hover:text-indigo-300"
                            href={`/#${SectionId.Hero}`}>
                            Back to top
                            <ArrowUpIcon className="h-3.5 w-3.5" />
                        </a>
                    </div>
                </div>
            </div>
        </footer>
    );
}
