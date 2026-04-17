import clsx from 'clsx';
import Image from 'next/image';

import {aboutData, SectionId} from '../../data/data';

const PROFILE_ALT = 'George Khananaev, Senior Full Stack Developer and Head of Development & IT Infrastructure at Moon Holidays, Bangkok';
const PROFILE_TITLE = 'George Khananaev, Senior Full Stack Developer';

export default function About() {
    const {profileImageSrc, description, aboutItems} = aboutData;
    return (
        <section
            className="relative overflow-hidden bg-neutral-900 px-4 py-20 sm:px-6 sm:py-24 lg:px-8 lg:py-28"
            id={SectionId.About}>
            {/* Indigo radial vignette — matches ContactCTA ("Think we're a fit?") on /work-with-me */}
            <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0"
                style={{
                    background:
                        'radial-gradient(ellipse at center, rgba(99, 102, 241, 0.12) 0%, rgba(23, 23, 23, 0) 60%)',
                }}
            />

            <div className="relative z-10 mx-auto max-w-screen-lg">
                <div className={clsx('grid grid-cols-1 gap-y-8 sm:gap-y-6', {'md:grid-cols-4 md:gap-x-10': !!profileImageSrc})}>
                    {!!profileImageSrc && (
                        <div className="col-span-1 flex justify-center md:justify-start">
                            <figure
                                className="relative h-64 w-64 overflow-hidden rounded-2xl shadow-xl shadow-indigo-500/10 ring-4 ring-indigo-400/20 md:h-56 md:w-56"
                                itemScope
                                itemType="https://schema.org/ImageObject">
                                <Image
                                    alt={PROFILE_ALT}
                                    fetchPriority="high"
                                    fill
                                    itemProp="contentUrl"
                                    priority
                                    sizes="(max-width: 768px) 256px, 224px"
                                    src={profileImageSrc}
                                    style={{objectFit: 'cover', objectPosition: 'top', transform: 'scale(1.15)', transformOrigin: 'center top'}}
                                    title={PROFILE_TITLE}
                                />
                                <meta content={PROFILE_ALT} itemProp="name" />
                                <meta content={PROFILE_ALT} itemProp="description" />
                                <span itemProp="creator" itemScope itemType="https://schema.org/Person">
                                    <meta content="George Khananaev" itemProp="name" />
                                </span>
                                <meta content="George Khananaev" itemProp="creditText" />
                                <meta content={`© ${new Date().getFullYear()} George Khananaev`} itemProp="copyrightNotice" />
                                <meta content="https://george.khananaev.com/" itemProp="license" />
                                <meta content="https://george.khananaev.com/contact" itemProp="acquireLicensePage" />
                                <figcaption className="sr-only">{PROFILE_ALT}</figcaption>
                            </figure>
                        </div>
                    )}
                    <div className={clsx('col-span-1 flex flex-col gap-y-6', {'md:col-span-3': !!profileImageSrc})}>
                        <div className="flex flex-col gap-y-3">
                            <p className="text-sm font-semibold uppercase tracking-widest text-indigo-400">About me</p>
                            <h2 className="text-3xl font-bold leading-tight text-white sm:text-4xl">About George Khananaev</h2>
                            <p className="mt-2 text-base leading-relaxed text-neutral-300 sm:text-lg">{description}</p>
                        </div>
                        <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                            {aboutItems.map(({label, text, Icon}, idx) => (
                                <li className="col-span-1 flex items-start gap-x-2.5" key={idx}>
                                    {Icon && <Icon className="h-5 w-5 shrink-0 text-indigo-400" />}
                                    <span className="text-sm font-semibold text-white">{label}:</span>
                                    <span className="text-sm text-neutral-400">{text}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </div>
        </section>
    );
}
