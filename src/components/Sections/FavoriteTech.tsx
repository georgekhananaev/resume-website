/* eslint-disable */

import {FC, memo, MouseEvent, useCallback, useEffect, useRef, useState} from 'react';
import {FavoriteTechItems, SectionId} from '../../data/data';

import Image from 'next/image';
import {FavoriteTechItem} from '../../data/dataDef';
import Section from '../Layout/Section';
import classNames from 'classnames';
import {isMobile} from '../../config';
import useDetectOutsideClick from '../../hooks/useDetectOutsideClick';

const FavoriteTech: FC = memo(() => {
    return (
        <Section className="bg-neutral-800" sectionId={SectionId.FavoriteTech}>
            <div className="flex flex-col gap-y-8">
                <h2 className="self-center text-xl font-bold text-white">My Favorite Technologies</h2>
                <div className="flex flex-col items-center">
                    <div className="w-full columns-3 md:columns-4 lg:columns-6">
                        {FavoriteTechItems.map((item, index) => {
                            const {title, image} = item;
                            return (
                                <div className="pb-3" key={`${title}-${index}`}>
                                    <div
                                        className={classNames(
                                            'relative h-max w-full overflow-hidden rounded-lg shadow-lg shadow-black/30 lg:shadow-xl',
                                        )}>
                                        <Image alt={title} layout="responsive" placeholder="blur" src={image}/>
                                        <ItemOverlay item={item}/>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </Section>
    );
});

FavoriteTech.displayName = 'FavoriteTech';
export default FavoriteTech;

const ItemOverlay: FC<{ item: FavoriteTechItem }> = memo(({item: {title}}) => {
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
                'absolute inset-0 h-full w-full  bg-gray-900 transition-all duration-300',
                {'opacity-0 hover:opacity-80': !mobile},
                showOverlay ? 'opacity-80' : 'opacity-0',
            )}
            onClick={handleItemClick}
            ref={linkRef}
            target="_blank">
            <div className="relative h-full w-full p-4">
                <div className="flex h-full w-full flex-col gap-y-2 overflow-y-auto">
                    <h2 className="text-center font-bold text-white opacity-100">{title}</h2>
                </div>

            </div>
        </a>
    );
});
