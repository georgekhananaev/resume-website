/* eslint-disable */

import {FC, memo} from 'react';
import {FavoriteTechItems, SectionId} from '../../data/data';

import Image from 'next/image';
import Section from '../Layout/Section';
import classNames from 'classnames';


const FavoriteTech: FC = memo(() => {
    return (
        <Section className="bg-neutral-800" sectionId={SectionId.FavoriteTech}>
            <div className="flex flex-col gap-y-8">
                <h2 className="self-center text-2xl font-bold text-white">My Favorite Technologies</h2>
                <div className="flex flex-col items-center">
                    <div className="w-full columns-4 md:columns-5 lg:columns-6">
                        {FavoriteTechItems.map((item, index) => {
                            const {title, image} = item;
                            return (
                                <div className="pb-3 opacity-75 hover:opacity-100 duration-200" key={`${title}-${index}`}>
                                    <div
                                        className={classNames(
                                            'relative h-max w-full overflow-hidden',
                                        )}>
                                        <Image className='rounded-lg' alt={title} src={image}/>
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
