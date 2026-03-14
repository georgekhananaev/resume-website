import {useEffect} from 'react';

import {SectionId} from '../data/data';

export const useNavObserver = (selectors: string, handler: (section: SectionId | null) => void) => {
    useEffect(() => {
        const sections = Array.from(document.querySelectorAll(selectors));
        if (!sections.length) return;

        let ticking = false;

        const update = () => {
            const scrollY = window.scrollY;
            const viewportHeight = window.innerHeight;
            const docHeight = document.documentElement.scrollHeight;

            // If at the bottom of page, select last section
            if (scrollY + viewportHeight >= docHeight - 50) {
                const id = sections[sections.length - 1]?.getAttribute('id');
                if (id) handler(id as SectionId);
                return;
            }

            // Find the section whose top is closest to (but above) the viewport top + offset
            const offset = viewportHeight * 0.3;
            let active: string | null = null;

            for (const section of sections) {
                const rect = section.getBoundingClientRect();
                if (rect.top <= offset) {
                    active = section.getAttribute('id');
                }
            }

            if (active) {
                handler(active as SectionId);
            }
        };

        const onScroll = () => {
            if (!ticking) {
                requestAnimationFrame(() => {
                    update();
                    ticking = false;
                });
                ticking = true;
            }
        };

        window.addEventListener('scroll', onScroll, {passive: true});
        update();

        return () => {
            window.removeEventListener('scroll', onScroll);
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
};
