import classNames from 'classnames';
import {FC, memo} from 'react';

import {SectionId} from '../../data/data';

const Section: FC<{ sectionId: SectionId; sectionTitle?: string; noPadding?: boolean; className?: string }> = memo(
    ({children, sectionId, noPadding = false, className}) => {
        return (
            <section className={classNames(className, {'px-4 py-12 md:py-16 lg:px-8': !noPadding})} id={sectionId}>
                <div className={classNames({'mx-auto max-w-screen-lg': !noPadding})}>{children}</div>
            </section>
        );
    },
);

Section.displayName = 'Section';
export default Section;
