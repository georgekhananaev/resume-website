import Image from 'next/image';

import {testimonial} from '../../data/data';

/**
 * Editorial pull-quote layout. Replaces the old parallax carousel with a
 * stacked list of quotes, each styled like a magazine pull quote with a
 * large faded quote mark behind it.
 *
 * No client-side state, no auto-advance, no dot navigation. All testimonials
 * visible at once. Every visitor sees every piece of social proof on first
 * paint.
 */
export default function Testimonials() {
    const {testimonials} = testimonial;
    if (!testimonials.length) return null;

    return (
        <section className="relative bg-neutral-950 px-4 py-24 sm:px-6 sm:py-28 lg:px-8 lg:py-32">
            {/* Radial glow backdrop, subtle */}
            <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0"
                style={{
                    background:
                        'radial-gradient(ellipse at center, rgba(99, 102, 241, 0.08) 0%, rgba(10,10,10,0) 55%)',
                }}
            />

            <div className="relative mx-auto max-w-screen-md">
                <div className="mb-16 text-center">
                    <p className="text-sm font-semibold uppercase tracking-widest text-indigo-400">What clients say</p>
                    <h2 className="mt-3 text-4xl font-bold leading-tight text-white sm:text-5xl lg:text-6xl">
                        Trusted by founders and operators
                    </h2>
                    <p className="mx-auto mt-6 max-w-xl text-base leading-relaxed text-neutral-400 sm:text-lg">
                        Unedited feedback from people I&apos;ve worked with over the last decade.
                    </p>
                </div>

                <div className="space-y-16 sm:space-y-20">
                    {testimonials.map((t, idx) => (
                        <figure className="relative" key={`${t.name}-${idx}`}>
                            {/* Oversized decorative quote mark */}
                            <span
                                aria-hidden="true"
                                className="pointer-events-none absolute -left-2 -top-8 select-none font-serif text-[120px] leading-none text-indigo-400/20 sm:-left-8 sm:-top-12 sm:text-[180px]">
                                &ldquo;
                            </span>

                            <blockquote className="relative text-lg italic leading-relaxed text-neutral-200 sm:text-xl sm:leading-relaxed">
                                {t.text}
                            </blockquote>

                            <figcaption className="mt-6 flex items-center gap-4">
                                {t.image && (
                                    <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-full ring-2 ring-indigo-400/30 sm:h-14 sm:w-14">
                                        <Image
                                            alt={t.alt}
                                            className="object-cover"
                                            fill
                                            loading="lazy"
                                            sizes="56px"
                                            src={t.image}
                                        />
                                    </div>
                                )}
                                <div>
                                    <p className="text-sm font-semibold uppercase tracking-widest text-indigo-400">
                                        {t.name}
                                    </p>
                                </div>
                            </figcaption>

                            {idx < testimonials.length - 1 && (
                                <div className="mt-16 h-px w-32 bg-gradient-to-r from-indigo-400/30 to-transparent" />
                            )}
                        </figure>
                    ))}
                </div>
            </div>
        </section>
    );
}
