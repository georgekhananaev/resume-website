/* eslint-disable */

import {FC, memo, MouseEvent, useCallback, useEffect, useRef, useState} from 'react';
import {portfolioItems, SectionId} from '../../data/data';

import {ExternalLinkIcon} from '@heroicons/react/outline';
import Image from 'next/image';
import {PortfolioItem} from '../../data/dataDef';
import Section from '../Layout/Section';
import classNames from 'classnames';
import {isMobile} from '../../config';
import useDetectOutsideClick from '../../hooks/useDetectOutsideClick';

const Portfolio: FC = memo(() => {
    return (
        <Section className="bg-neutral-800" sectionId={SectionId.Portfolio}>
            <div className="flex flex-col gap-y-8">
                <h2 className="self-center text-2xl font-bold text-white">Check out some of my work</h2>
                <div className="w-full columns-2 md:columns-4 lg:columns-4 mb-6">
                    {portfolioItems.map((item, index) => {
                        const {title, image} = item;
                        return (
                            <div className="pb-3" key={`${title}-${index}`}>
                                <div
                                    className={classNames(
                                        'relative h-full w-full overflow-hidden',
                                    )}>
                                    <Image className="rounded-lg" alt={title} src={image}/>
                                    <ItemOverlay item={item}/>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </Section>
    );
});

Portfolio.displayName = 'Portfolio';
export default Portfolio;

const ItemOverlay: FC<{ item: PortfolioItem }> = memo(({item: {url, title, description}}) => {
    const [mobile, setMobile] = useState(false);
    const [showOverlay, setShowOverlay] = useState(false);
    const linkRef = useRef<HTMLAnchorElement>(null);

    useEffect(() => {
        // Avoid hydration styling errors by setting mobile in useEffect
        if (isMobile) {
            setMobile(true);
        }
    }, []);
    useDetectOutsideClick(linkRef, () => setShowOverlay(false));

    const handleItemClick = useCallback(
        (event: MouseEvent<HTMLElement>) => {
            if (mobile && !showOverlay) {
                event.preventDefault();
                setShowOverlay(!showOverlay);
            }
        },
        [mobile, showOverlay],
    );

    return (
        <a
            className={classNames(
                'absolute inset-0 rounded-lg custom-h-full w-full  bg-gray-900 transition-all duration-300',
                {'opacity-0 hover:opacity-80': !mobile},
                showOverlay ? 'opacity-80' : 'opacity-0',
            )}
            href={url}
            onClick={handleItemClick}
            ref={linkRef}
            target="_blank">
            <div className="relative h-full w-full p-4">
                <div className="flex h-full w-full flex-col gap-y-2 overflow-y-auto">
                    <h2 className="text-center font-bold text-white opacity-100">{title}</h2>
                    <p className="text-base text-stone-100 opacity-100 sm:text-base">{description}</p>
                </div>
                <ExternalLinkIcon
                    className="absolute bottom-1 right-1 h-4 w-4 shrink-0 text-white sm:bottom-2 sm:right-2"/>
            </div>
        </a>
    );
});
