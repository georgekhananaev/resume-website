/* eslint-disable */

import {FC, memo} from 'react';
import {aboutData, SectionId} from '../../data/data';

import Image from 'next/image';
import Section from '../Layout/Section';
import classNames from 'classnames';

const About: FC = memo(() => {
    const {profileImageSrc, description, aboutItems} = aboutData;
    return (
        <Section className="bg-neutral-800" sectionId={SectionId.About}>
            <div className={classNames('grid grid-cols-1 gap-y-4', {'md:grid-cols-4': !!profileImageSrc})}>
                {!!profileImageSrc && (
                    <div className="col-span-1 flex justify-center md:justify-start">
                        <div className="relative h-64 w-64 overflow-hidden rounded-xl md:h-56 md:w-56">
                            <Image alt="about-me-image" layout="fill" objectFit="cover" src={profileImageSrc}/>
                        </div>
                    </div>
                )}
                <div className={classNames('col-span-1 flex flex-col gap-y-6', {'md:col-span-3': !!profileImageSrc})}>
                    <div className="flex flex-col gap-y-2">
                        <h2 className="text-2xl font-bold text-white">About me</h2>
                        <p className="prose prose-sm text-gray-300 sm:prose-base">{description} <i
                            className="text-yellow-300 fa-solid fa-face-laugh-wink"></i></p>
                    </div>
                    <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                        {aboutItems.map(({label, text, Icon}, idx) => (
                            <li className="col-span-1 flex  items-start gap-x-2" key={idx}>
                                {Icon && <Icon className="h-5 w-5 text-white"/>}
                                <span className="text-sm font-bold text-white">{label}:</span>
                                <span className=" text-sm text-gray-300">{text}</span>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </Section>
    );
});

About.displayName = 'About';
export default About;
