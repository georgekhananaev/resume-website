'use client';

import {Dialog, DialogBackdrop, DialogPanel} from '@headlessui/react';
import {Bars3Icon, XMarkIcon} from '@heroicons/react/24/outline';
import clsx from 'clsx';
import Image from 'next/image';
import Link from 'next/link';
import {usePathname} from 'next/navigation';
import {useCallback, useState} from 'react';

export const headerID = 'headerNav';

type NavLink = {
    label: string;
    href: string;
};

// About, Resume, and Github are all sections of the home page, so they live
// behind a single "Home" entry. Portfolio and Contact are dedicated routes.
const NAV_LINKS: NavLink[] = [
    {label: 'Home', href: '/'},
    {label: 'Portfolio', href: '/portfolio'},
    {label: 'Contact', href: '/contact'},
];

const WORK_HREF = '/work-with-me';

function useIsActive() {
    const pathname = usePathname() ?? '/';
    return useCallback(
        (href: string) => {
            if (href === '/') return pathname === '/';
            return pathname === href || pathname.startsWith(`${href}/`);
        },
        [pathname],
    );
}

export default function Header() {
    return (
        <>
            <MobileNav />
            <DesktopNav />
        </>
    );
}

function Avatar() {
    return (
        <span className="relative block h-9 w-9 shrink-0 overflow-hidden rounded-full shadow-lg shadow-indigo-500/25 ring-2 ring-indigo-400/40 transition-all group-hover:ring-indigo-400">
            <Image
                alt="George Khananaev"
                className="h-full w-full object-cover"
                height={1280}
                priority
                src="/webp/george_khananaev_ws.webp"
                style={{objectPosition: 'center top'}}
                width={1129}
            />
        </span>
    );
}

function DesktopNav() {
    const isActive = useIsActive();
    const workActive = isActive(WORK_HREF);

    return (
        <header
            className="fixed top-0 z-50 hidden w-full border-b border-white/5 bg-neutral-950/70 backdrop-blur-xl sm:block"
            id={headerID}>
            <nav className="mx-auto flex max-w-6xl items-center justify-between px-6 py-3">
                <Link
                    aria-label="George Khananaev, home"
                    className="group flex items-center gap-2.5 text-sm font-bold tracking-tight text-white transition-colors hover:text-indigo-300"
                    href="/">
                    <Avatar />
                    <span className="hidden md:inline">George Khananaev</span>
                </Link>
                <ul className="flex items-center gap-1">
                    {NAV_LINKS.map(link => {
                        const active = isActive(link.href);
                        return (
                            <li key={link.href}>
                                <Link
                                    aria-current={active ? 'page' : undefined}
                                    className={clsx(
                                        'relative inline-flex items-center rounded-full px-4 py-2 text-sm font-semibold transition-colors focus:outline-hidden focus-visible:ring-2 focus-visible:ring-indigo-400',
                                        active ? 'text-white' : 'text-neutral-300 hover:text-white',
                                    )}
                                    href={link.href}>
                                    {active && (
                                        <span
                                            aria-hidden="true"
                                            className="absolute inset-0 rounded-full bg-white/10 ring-1 ring-white/15"
                                        />
                                    )}
                                    <span className="relative">{link.label}</span>
                                </Link>
                            </li>
                        );
                    })}
                    <li className="ml-2">
                        <Link
                            aria-current={workActive ? 'page' : undefined}
                            className={clsx(
                                'inline-flex items-center rounded-full px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-indigo-500/30 transition-all focus:outline-hidden focus-visible:ring-2 focus-visible:ring-indigo-300',
                                workActive
                                    ? 'bg-indigo-400 ring-2 ring-white/30'
                                    : 'bg-indigo-500 hover:scale-[1.02] hover:bg-indigo-400',
                            )}
                            href={WORK_HREF}>
                            Work with me
                        </Link>
                    </li>
                </ul>
            </nav>
        </header>
    );
}

function MobileNav() {
    const [isOpen, setIsOpen] = useState<boolean>(false);
    const isActive = useIsActive();

    const close = useCallback(() => setIsOpen(false), []);
    const toggle = useCallback(() => setIsOpen(o => !o), []);

    return (
        <>
            <div className="fixed inset-x-0 top-0 z-40 flex items-center justify-between border-b border-white/5 bg-neutral-950/80 px-4 py-3 backdrop-blur-xl sm:hidden">
                <Link
                    aria-label="George Khananaev, home"
                    className="group flex items-center gap-2 text-sm font-bold text-white"
                    href="/"
                    onClick={close}>
                    <Avatar />
                </Link>
                <button
                    aria-label="Open menu"
                    className="inline-flex items-center justify-center rounded-full bg-white/5 p-2 text-white ring-1 ring-white/10 transition-colors hover:bg-white/10 focus:outline-hidden focus-visible:ring-2 focus-visible:ring-indigo-400"
                    onClick={toggle}>
                    <Bars3Icon className="h-6 w-6" />
                </button>
            </div>
            <Dialog as="div" className="relative z-50 sm:hidden" onClose={close} open={isOpen}>
                <DialogBackdrop
                    className="fixed inset-0 bg-neutral-950/80 backdrop-blur-sm transition-opacity duration-300 data-[closed]:opacity-0"
                    transition
                />
                <div className="fixed inset-0 flex justify-end">
                    <DialogPanel
                        className="relative flex w-4/5 max-w-sm flex-col border-l border-white/10 bg-neutral-900/95 shadow-2xl backdrop-blur-xl transition duration-300 ease-out data-[closed]:translate-x-full"
                        transition>
                        <div className="flex items-center justify-between border-b border-white/10 px-5 py-4">
                            <span className="text-xs font-bold uppercase tracking-widest text-neutral-400">Menu</span>
                            <button
                                aria-label="Close menu"
                                className="rounded-full p-1 text-neutral-300 transition-colors hover:text-white"
                                onClick={close}>
                                <XMarkIcon className="h-6 w-6" />
                            </button>
                        </div>
                        <nav className="flex flex-col gap-1 px-4 py-6">
                            {NAV_LINKS.map(link => {
                                const active = isActive(link.href);
                                return (
                                    <Link
                                        aria-current={active ? 'page' : undefined}
                                        className={clsx(
                                            'rounded-xl px-4 py-3 text-base font-semibold transition-colors',
                                            active
                                                ? 'bg-white/10 text-white ring-1 ring-white/15'
                                                : 'text-neutral-300 hover:bg-white/5 hover:text-white',
                                        )}
                                        href={link.href}
                                        key={link.href}
                                        onClick={close}>
                                        {link.label}
                                    </Link>
                                );
                            })}
                            <Link
                                className="mt-4 inline-flex items-center justify-center rounded-full bg-indigo-500 px-4 py-3 text-sm font-bold text-white shadow-lg shadow-indigo-500/30 transition-colors hover:bg-indigo-400"
                                href={WORK_HREF}
                                onClick={close}>
                                Work with me
                            </Link>
                        </nav>
                    </DialogPanel>
                </div>
            </Dialog>
        </>
    );
}
