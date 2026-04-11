import {hireServices} from '../../data/data';

/**
 * Editorial numbered list layout. Deliberately NOT a card grid so /work-with-me
 * feels visually distinct from / and /portfolio (which use card grids).
 *
 * Layout: big monospaced numbers in the left column, typography-forward
 * service details in the right column. Each entry is separated by a faint
 * indigo rule to reinforce the editorial rhythm.
 */
export default function Services() {
    return (
        <section className="relative bg-neutral-950 px-4 py-24 sm:px-6 sm:py-28 lg:px-8 lg:py-32" id="services">
            {/* Subtle grid mesh backdrop so the section feels like a continuation
                of the hero, not a hard break into a new design. */}
            <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 opacity-[0.035]"
                style={{
                    backgroundImage: 'linear-gradient(to right, #fff 1px, transparent 1px), linear-gradient(to bottom, #fff 1px, transparent 1px)',
                    backgroundSize: '80px 80px',
                }}
            />

            <div className="relative mx-auto max-w-screen-md">
                <div className="mb-20">
                    <p className="text-sm font-semibold uppercase tracking-widest text-indigo-400">How I work</p>
                    <h2 className="mt-3 text-4xl font-bold leading-tight text-white sm:text-5xl lg:text-6xl">
                        Where I add the most value
                    </h2>
                    <p className="mt-6 max-w-xl text-base leading-relaxed text-neutral-400 sm:text-lg">
                        Selected engagements across architecture, delivery, and technical leadership. Most clients start with a specific problem and expand into a retainer from there.
                    </p>
                </div>

                <ol className="space-y-14 sm:space-y-16">
                    {hireServices.map((svc, idx) => {
                        const number = String(idx + 1).padStart(2, '0');
                        return (
                            <li
                                className="group grid grid-cols-[64px_1fr] gap-x-6 sm:grid-cols-[96px_1fr] sm:gap-x-10"
                                key={svc.title}>
                                <div className="flex items-start pt-2">
                                    <span
                                        aria-hidden="true"
                                        className="font-mono text-3xl font-bold tabular-nums text-indigo-400/70 transition-colors group-hover:text-indigo-300 sm:text-5xl">
                                        {number}
                                    </span>
                                </div>
                                <div>
                                    <div className="flex items-center gap-3">
                                        {svc.Icon && (
                                            <svc.Icon className="h-5 w-5 flex-shrink-0 text-indigo-400 sm:h-6 sm:w-6" />
                                        )}
                                        <h3 className="text-xl font-bold text-white sm:text-2xl">{svc.title}</h3>
                                    </div>
                                    <p className="mt-4 text-base leading-relaxed text-neutral-300 sm:text-lg">
                                        {svc.description}
                                    </p>
                                    <div className="mt-6 h-px w-16 bg-gradient-to-r from-indigo-400/50 to-transparent transition-all duration-500 group-hover:w-32 group-hover:from-indigo-400/80" />
                                </div>
                            </li>
                        );
                    })}
                </ol>
            </div>
        </section>
    );
}
