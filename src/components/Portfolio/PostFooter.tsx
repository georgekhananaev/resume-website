import {ArrowRightIcon} from '@heroicons/react/24/outline';
import Image from 'next/image';
import Link from 'next/link';

import type {Post} from '../../types/post';

export default function PostFooter({post}: {post: Post}) {
    return (
        <footer className="mx-auto max-w-3xl px-4 pb-8 sm:px-6 lg:px-0">
            {post.githubUrl && (
                <div className="mb-10 rounded-2xl border border-white/10 bg-neutral-900/50 p-6 text-center">
                    <p className="text-sm text-neutral-400">View the code on GitHub</p>
                    <a
                        className="mt-2 inline-flex items-center gap-2 text-lg font-semibold text-indigo-400 transition-colors hover:text-indigo-300"
                        href={post.githubUrl}
                        rel="noopener noreferrer"
                        target="_blank">
                        {post.githubUrl.replace('https://github.com/', '')}
                        <ArrowRightIcon className="h-5 w-5" />
                    </a>
                </div>
            )}

            {/* Author bio — the primary internal link back to / on every post page. */}
            <aside className="mb-10 flex flex-col gap-5 rounded-2xl border border-white/10 bg-neutral-900/50 p-6 sm:flex-row sm:items-center sm:p-8">
                <Link
                    aria-label="About George Khananaev"
                    className="relative block h-20 w-20 shrink-0 overflow-hidden rounded-full ring-2 ring-indigo-400/40 transition-all hover:ring-indigo-400 sm:h-24 sm:w-24"
                    href="/">
                    <Image
                        alt="George Khananaev"
                        className="h-full w-full object-cover"
                        height={1280}
                        src="/webp/george_khananaev_ws.webp"
                        style={{objectPosition: 'center top'}}
                        width={1129}
                    />
                </Link>
                <div className="flex-1 text-center sm:text-left">
                    <p className="text-xs font-semibold uppercase tracking-widest text-indigo-400">About the author</p>
                    <Link className="mt-1 block text-xl font-bold text-white transition-colors hover:text-indigo-300" href="/">
                        George Khananaev
                    </Link>
                    <p className="mt-2 text-sm leading-relaxed text-neutral-300">
                        Senior Full Stack Developer and Head of Development &amp; IT Infrastructure at{' '}
                        <a
                            className="text-indigo-300 hover:text-indigo-200"
                            href="https://moonholidays.co.th"
                            rel="noopener noreferrer"
                            target="_blank">
                            Moon Holidays
                        </a>
                        , Bangkok. Architecting multi-tenant platforms, real-time data pipelines, and AI-driven enterprise systems.
                    </p>
                    <div className="mt-4 flex flex-wrap items-center justify-center gap-3 text-sm sm:justify-start">
                        <Link
                            className="inline-flex items-center gap-1.5 font-semibold text-indigo-300 transition-colors hover:text-indigo-200"
                            href="/">
                            george.khananaev.com
                            <ArrowRightIcon className="h-4 w-4" />
                        </Link>
                        <span aria-hidden="true" className="text-neutral-700">·</span>
                        <Link className="text-neutral-400 transition-colors hover:text-indigo-300" href="/portfolio">
                            Portfolio
                        </Link>
                        <span aria-hidden="true" className="text-neutral-700">·</span>
                        <Link className="text-neutral-400 transition-colors hover:text-indigo-300" href="/work-with-me">
                            Work with me
                        </Link>
                    </div>
                </div>
            </aside>

            <div className="rounded-2xl bg-gradient-to-br from-indigo-500 to-indigo-600 p-8 text-center shadow-xl shadow-indigo-500/20">
                <h2 className="text-2xl font-bold text-white sm:text-3xl">Working on something similar?</h2>
                <p className="mx-auto mt-3 max-w-xl text-base text-indigo-50">
                    I take on a handful of engagements at a time: architecture reviews, platform rescues, AI integration, and fractional technical leadership. The clearer the brief, the faster the reply.
                </p>
                <Link
                    className="mt-6 inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-semibold text-indigo-600 shadow-lg transition-transform hover:scale-105"
                    href="/work-with-me">
                    How I work
                    <ArrowRightIcon className="h-5 w-5" />
                </Link>
            </div>
        </footer>
    );
}
