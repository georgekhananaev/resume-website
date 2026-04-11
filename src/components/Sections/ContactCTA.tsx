import {ArrowRightIcon, EnvelopeIcon} from '@heroicons/react/24/outline';
import Link from 'next/link';

/**
 * Bottom-of-page CTA for /work-with-me. Points visitors at the dedicated /contact
 * page instead of embedding a form here — the form lives on one page only.
 *
 * Editorial layout (centred heading, subtle gradient backdrop, single CTA)
 * deliberately different from the card / grid UI on /portfolio and /.
 */
export default function ContactCTA() {
    return (
        <section className="relative overflow-hidden bg-neutral-950 px-4 py-24 sm:px-6 sm:py-32 lg:px-8 lg:py-40">
            {/* Radial backdrop */}
            <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0"
                style={{
                    background:
                        'radial-gradient(ellipse at center, rgba(99, 102, 241, 0.12) 0%, rgba(10,10,10,0) 60%)',
                }}
            />

            <div className="relative mx-auto max-w-screen-md text-center">
                <div className="inline-flex h-16 w-16 items-center justify-center rounded-2xl border border-indigo-400/30 bg-indigo-400/10">
                    <EnvelopeIcon className="h-8 w-8 text-indigo-300" />
                </div>

                <p className="mt-6 text-sm font-semibold uppercase tracking-widest text-indigo-400">
                    Get in touch
                </p>

                <h2 className="mt-3 text-4xl font-bold leading-tight text-white sm:text-5xl lg:text-6xl">
                    Think we&apos;re a fit?
                </h2>

                <p className="mx-auto mt-6 max-w-xl text-base leading-relaxed text-neutral-300 sm:text-lg">
                    Send a brief describing the problem, the rough timeline, and the outcome you want. Inquiries that fit get a reply within a day.
                </p>

                <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
                    <Link
                        className="inline-flex items-center gap-x-2 rounded-full bg-indigo-500 px-8 py-4 text-base font-semibold text-white shadow-xl shadow-indigo-500/40 transition-all hover:-translate-y-0.5 hover:bg-indigo-400 sm:text-lg"
                        href="/contact">
                        Send a message
                        <ArrowRightIcon className="h-5 w-5" />
                    </Link>
                </div>

                <p className="mt-10 text-xs text-neutral-500">
                    Not the right fit yet? Browse the{' '}
                    <Link className="text-indigo-400 transition-colors hover:text-indigo-300" href="/portfolio">
                        portfolio
                    </Link>{' '}
                    for context on how I work, or read{' '}
                    <Link className="text-indigo-400 transition-colors hover:text-indigo-300" href="/portfolio/travel-panel-core-platform">
                        the Travel Panel case study
                    </Link>{' '}
                    to see a platform I designed and built from zero.
                </p>
            </div>
        </section>
    );
}
