'use client';

import {Dialog, DialogBackdrop, DialogPanel} from '@headlessui/react';
import {Bars3Icon} from '@heroicons/react/24/outline';
import clsx from 'clsx';
import Link from 'next/link';
import {useCallback, useMemo, useState} from 'react';

import {SectionId} from '../../data/data';
import {useNavObserver} from '../../hooks/useNavObserver';

export const headerID = 'headerNav';

export default function Header() {
    const [currentSection, setCurrentSection] = useState<SectionId | null>(null);
    const navSections = useMemo(
        () => [SectionId.About, SectionId.Resume, SectionId.Github, SectionId.Portfolio, SectionId.Testimonials, SectionId.Contact],
        [],
    );

    const intersectionHandler = useCallback((section: SectionId | null) => {
        if (section) setCurrentSection(section);
    }, []);

    useNavObserver(navSections.map(section => `#${section}`).join(','), intersectionHandler);

    return (
        <>
            <MobileNav currentSection={currentSection} navSections={navSections} />
            <DesktopNav currentSection={currentSection} navSections={navSections} />
        </>
    );
}

function DesktopNav({navSections, currentSection}: {navSections: SectionId[]; currentSection: SectionId | null}) {
    const baseClass =
        '-m-1.5 p-1.5 rounded-md font-bold first-letter:uppercase hover:transition-colors hover:duration-300 focus:outline-hidden focus-visible:ring-2 focus-visible:ring-orange-500 sm:hover:text-orange-500 text-neutral-100';
    const activeClass = clsx(baseClass, 'text-orange-500');
    const inactiveClass = clsx(baseClass, 'text-neutral-100');
    return (
        <header className="fixed top-0 z-50 hidden w-full bg-neutral-900/50 p-4 backdrop-blur sm:block" id={headerID}>
            <nav className="flex justify-center gap-x-8">
                {navSections.map(section => (
                    <NavItem
                        activeClass={activeClass}
                        current={section === currentSection}
                        inactiveClass={inactiveClass}
                        key={section}
                        section={section}
                    />
                ))}
            </nav>
        </header>
    );
}

function MobileNav({navSections, currentSection}: {navSections: SectionId[]; currentSection: SectionId | null}) {
    const [isOpen, setIsOpen] = useState<boolean>(false);

    const toggleOpen = useCallback(() => {
        setIsOpen(!isOpen);
    }, [isOpen]);

    const baseClass =
        'p-2 rounded-md first-letter:uppercase transition-colors duration-300 focus:outline-hidden focus-visible:ring-2 focus-visible:ring-orange-500';
    const activeClass = clsx(baseClass, 'bg-neutral-900 text-white font-bold');
    const inactiveClass = clsx(baseClass, 'text-neutral-200 font-medium');
    return (
        <>
            <button
                aria-label="Menu Button"
                className="fixed right-2 top-2 z-40 rounded-md bg-orange-500 p-2 ring-offset-gray-800/60 hover:bg-orange-400 focus:outline-hidden focus:ring-0 focus-visible:ring-2 focus-visible:ring-orange-500 focus-visible:ring-offset-2 sm:hidden"
                onClick={toggleOpen}>
                <Bars3Icon className="h-8 w-8 text-white" />
                <span className="sr-only">Open sidebar</span>
            </button>
            <Dialog as="div" className="fixed inset-0 z-40 flex sm:hidden" onClose={toggleOpen} open={isOpen}>
                <DialogBackdrop
                    className="fixed inset-0 bg-stone-900/75 transition-opacity duration-300 data-[closed]:opacity-0"
                    transition
                />
                <DialogPanel
                    className="relative w-4/5 bg-stone-800 transition duration-300 ease-in-out data-[closed]:-translate-x-full"
                    transition>
                    <nav className="mt-5 flex flex-col gap-y-2 px-2">
                        {navSections.map(section => (
                            <NavItem
                                activeClass={activeClass}
                                current={section === currentSection}
                                inactiveClass={inactiveClass}
                                key={section}
                                onClick={toggleOpen}
                                section={section}
                            />
                        ))}
                    </nav>
                </DialogPanel>
            </Dialog>
        </>
    );
}

function NavItem({section, current, inactiveClass, activeClass, onClick}: {
    section: string;
    current: boolean;
    activeClass: string;
    inactiveClass: string;
    onClick?: () => void;
}) {
    return (
        <Link className={clsx(current ? activeClass : inactiveClass)} href={`/#${section}`} onClick={onClick}>
            {section}
        </Link>
    );
}
