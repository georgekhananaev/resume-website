import clsx from 'clsx';
import {ReactNode} from 'react';

import {SectionId} from '../../data/data';

export default function Section({children, sectionId, noPadding = false, className}: {
    children: ReactNode;
    sectionId: SectionId;
    sectionTitle?: string;
    noPadding?: boolean;
    className?: string;
}) {
    return (
        <section className={clsx(className, {'px-4 py-10 sm:px-6 sm:py-12 md:py-16 lg:px-8': !noPadding})} id={sectionId}>
            <div className={clsx({'mx-auto max-w-screen-lg': !noPadding})}>{children}</div>
        </section>
    );
}
