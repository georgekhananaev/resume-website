import Image from 'next/image';
import type {ReactNode} from 'react';

export interface PageHeroImage {
    src: string;
    alt: string;
    width: number;
    height: number;
}

export interface PageHeroProps {
    /** Small uppercase pill shown above the title. */
    eyebrow: string;
    /** Main h1 heading. */
    title: string;
    /** Optional indigo-toned tagline rendered between the title and description. */
    subtitle?: string;
    /** Longer descriptive paragraph under the subtitle. Accepts plain text or JSX. */
    description?: ReactNode;
    /** Optional round avatar rendered above the eyebrow. */
    image?: PageHeroImage;
}

/**
 * Shared hero section for top-level landing pages (/portfolio, /contact,
 * /portfolio/tag/[tag]). Matches the editorial language used by HireHero and
 * Services: dark neutral background, subtle grid mesh backdrop, indigo radial
 * vignette, and the same eyebrow → title → subtitle → description rhythm so
 * every landing page feels like part of the same design family.
 *
 * Breadcrumbs are rendered separately by `<PageBreadcrumbs>` so they always
 * sit in the same slot — flush below the fixed header.
 */
export default function PageHero({eyebrow, title, subtitle, description, image}: PageHeroProps) {
    return (
        <section className="relative overflow-hidden border-b border-white/5 bg-neutral-950 px-4 py-28 sm:px-6 sm:py-32 lg:px-8 lg:py-40">
            {/* Grid mesh backdrop — matches Services / FavoriteTech / GithubStats */}
            <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 opacity-[0.035]"
                style={{
                    backgroundImage:
                        'linear-gradient(to right, #fff 1px, transparent 1px), linear-gradient(to bottom, #fff 1px, transparent 1px)',
                    backgroundSize: '80px 80px',
                }}
            />
            {/* Indigo radial vignette — matches HireHero / ContactCTA */}
            <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0"
                style={{
                    background:
                        'radial-gradient(ellipse at center, rgba(99, 102, 241, 0.10) 0%, rgba(10,10,10,0) 60%)',
                }}
            />

            <div className="relative z-10 mx-auto max-w-screen-md text-center">
                {image && (
                    <div className="mx-auto mb-8 h-28 w-28 overflow-hidden rounded-full shadow-xl shadow-indigo-500/20 ring-4 ring-indigo-400/30 sm:h-32 sm:w-32">
                        <Image
                            alt={image.alt}
                            className="h-full w-full object-cover"
                            height={image.height}
                            priority
                            src={image.src}
                            style={{objectPosition: 'center top'}}
                            width={image.width}
                        />
                    </div>
                )}
                <div className="mb-5 inline-block rounded-full border border-indigo-400/40 bg-indigo-400/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-indigo-300">
                    {eyebrow}
                </div>
                <h1 className="text-4xl font-bold leading-tight text-white sm:text-6xl lg:text-7xl">{title}</h1>
                {subtitle && (
                    <p className="mt-5 text-lg font-medium text-indigo-400 sm:text-xl">{subtitle}</p>
                )}
                {description && (
                    <p className="mx-auto mt-6 max-w-xl text-base leading-relaxed text-neutral-300 sm:text-lg">
                        {description}
                    </p>
                )}
            </div>
        </section>
    );
}
