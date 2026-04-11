import {ChatBubbleLeftRightIcon} from '@heroicons/react/24/outline';

import {contact, SectionId} from '../../../data/data';
import {ContactType, ContactValue} from '../../../data/dataDef';
import GithubIcon from '../../Icon/GithubIcon';
import LinkedInIcon from '../../Icon/LinkedInIcon';
import RecaptchaProvider from '../../RecaptchaProvider';
import ContactForm from './ContactForm';

const ContactValueMap: Record<ContactType, ContactValue> = {
    [ContactType.Github]: {Icon: GithubIcon, srLabel: 'Github'},
    [ContactType.LinkedIn]: {Icon: LinkedInIcon, srLabel: 'LinkedIn'},
};

/**
 * Editorial contact section used on /contact. Matches the visual language
 * shared by Services / FavoriteTech / HireHero: dark background, subtle grid
 * mesh backdrop, indigo accents, editorial eyebrow-and-title header. The
 * form itself is untouched — only the wrapping layout / chrome has changed.
 */
export default function Contact() {
    const {items} = contact;
    return (
        <section
            className="relative overflow-hidden bg-neutral-950 px-4 py-24 sm:px-6 sm:py-28 lg:px-8 lg:py-32"
            id={SectionId.Contact}>
            {/* Grid mesh backdrop */}
            <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 opacity-[0.035]"
                style={{
                    backgroundImage:
                        'linear-gradient(to right, #fff 1px, transparent 1px), linear-gradient(to bottom, #fff 1px, transparent 1px)',
                    backgroundSize: '80px 80px',
                }}
            />
            {/* Indigo radial vignette */}
            <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0"
                style={{
                    background:
                        'radial-gradient(ellipse at top, rgba(99, 102, 241, 0.08) 0%, rgba(10,10,10,0) 55%)',
                }}
            />

            <div className="relative mx-auto max-w-screen-lg">
                <div className="grid grid-cols-1 gap-12 lg:grid-cols-[1fr_380px] lg:gap-16">
                    {/* Left: form in editorial card */}
                    <div className="order-2 lg:order-1">
                        <div className="mb-6 flex items-center gap-3">
                            <span className="font-mono text-xs font-bold uppercase tracking-widest text-indigo-400/80">
                                The form
                            </span>
                            <span className="h-px flex-1 bg-gradient-to-r from-indigo-400/40 to-transparent" />
                        </div>
                        <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-6 backdrop-blur-sm sm:p-8">
                            <RecaptchaProvider>
                                <ContactForm />
                            </RecaptchaProvider>
                        </div>
                    </div>

                    {/* Right: preferred contact method + channels */}
                    <aside className="order-1 flex flex-col gap-8 lg:order-2">
                        <div className="relative overflow-hidden rounded-2xl border border-indigo-400/30 bg-gradient-to-br from-indigo-500/10 to-indigo-500/[0.02] p-6">
                            <div className="flex items-start gap-4">
                                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-indigo-400/40 bg-indigo-400/10">
                                    <ChatBubbleLeftRightIcon className="h-6 w-6 text-indigo-300" />
                                </span>
                                <div>
                                    <p className="text-xs font-bold uppercase tracking-widest text-indigo-300">
                                        Preferred: WhatsApp
                                    </p>
                                    <p className="mt-2 text-sm leading-relaxed text-neutral-200">
                                        Leave your WhatsApp number in the form for a faster response. Email replies may
                                        take a few days, WhatsApp usually gets a same-day answer.
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div>
                            <p className="font-mono text-xs font-bold uppercase tracking-widest text-indigo-400/80">
                                Other channels
                            </p>
                            <ul className="mt-5 space-y-3">
                                {items.map(({type, text, href}) => {
                                    const {Icon, srLabel} = ContactValueMap[type];
                                    return (
                                        <li key={srLabel}>
                                            <a
                                                className="group inline-flex items-center gap-3 text-sm text-neutral-300 transition-colors hover:text-indigo-300"
                                                href={href}
                                                rel="me noopener noreferrer"
                                                target="_blank">
                                                <span className="flex h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-white/5 transition-colors group-hover:border-indigo-400/40 group-hover:bg-indigo-400/5">
                                                    <Icon aria-hidden="true" className="h-4 w-4" />
                                                </span>
                                                <span className="font-medium">{text}</span>
                                            </a>
                                        </li>
                                    );
                                })}
                            </ul>
                        </div>

                        <div>
                            <p className="font-mono text-xs font-bold uppercase tracking-widest text-indigo-400/80">
                                Good to know
                            </p>
                            <ul className="mt-5 space-y-3 text-sm leading-relaxed text-neutral-400">
                                <li className="flex gap-2">
                                    <span className="mt-[7px] h-1 w-1 shrink-0 rounded-full bg-indigo-400" />
                                    <span>Based in Bangkok (UTC+7), available for remote engagements worldwide.</span>
                                </li>
                                <li className="flex gap-2">
                                    <span className="mt-[7px] h-1 w-1 shrink-0 rounded-full bg-indigo-400" />
                                    <span>Currently booking a limited number of retainers and project engagements.</span>
                                </li>
                                <li className="flex gap-2">
                                    <span className="mt-[7px] h-1 w-1 shrink-0 rounded-full bg-indigo-400" />
                                    <span>I respond to every inquiry personally, never forwarded to an assistant.</span>
                                </li>
                            </ul>
                        </div>
                    </aside>
                </div>
            </div>
        </section>
    );
}
