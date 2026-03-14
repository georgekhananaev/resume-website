import Image from 'next/image';

import {FavoriteTechItems, SectionId} from '../../data/data';
import Section from '../Layout/Section';

export default function FavoriteTech() {
    return (
        <Section className="bg-neutral-800" sectionId={SectionId.FavoriteTech}>
            <div className="flex flex-col gap-y-8">
                <h2 className="self-center text-2xl font-bold text-white">My Favorite Technologies</h2>
                <div className="flex flex-col items-center">
                    <div className="w-full columns-2 sm:columns-3 md:columns-5 lg:columns-6">
                        {FavoriteTechItems.map((item, index) => {
                            const {title, image} = item;
                            return (
                                <div className="pb-3 opacity-75 duration-200 hover:opacity-100"
                                     key={`${title}-${index}`}>
                                    <div className="relative h-max w-full overflow-hidden">
                                        <Image alt={title} className="rounded-lg" src={image} />
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </Section>
    );
}
