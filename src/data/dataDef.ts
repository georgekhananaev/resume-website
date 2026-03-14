import {StaticImageData} from 'next/image';
import {ReactNode, SVGProps} from 'react';

import {IconProps} from '../components/Icon/Icon';

export interface Hero {
    imageSrc: string | StaticImageData;
    name: string;
    description: ReactNode;
    actions: HeroActionItem[];
}

interface HeroActionItem {
    href: string;
    text: string;
    primary?: boolean;
    Icon?: (props: SVGProps<SVGSVGElement>) => ReactNode;
}

export interface About {
    profileImageSrc?: string | StaticImageData;
    description: string;
    aboutItems: AboutItem[];
}

export interface AboutItem {
    label: string;
    text: string;
    Icon?: (props: SVGProps<SVGSVGElement>) => ReactNode;
}

export interface Skill {
    name: string;
    level: number;
    max?: number;
}

export interface SkillGroup {
    name: string;
    skills: Skill[];
}

export interface PortfolioItem {
    title: string;
    description: string;
    url: string;
    image: string | StaticImageData;
    stars?: number;
}

export interface FavoriteTechItem {
    title: string;
    image: string | StaticImageData;
    category: string;
}

export interface TimelineItem {
    date: string;
    location: string;
    title: string;
    content: ReactNode;
}

export interface TestimonialSection {
    imageSrc?: string | StaticImageData;
    testimonials: Testimonial[];
}

export interface Testimonial {
    image?: string;
    name: string;
    text: string;
    alt: string;
}

export interface ContactSection {
    headerText?: string;
    description: string;
    items: ContactItem[];
}

export const ContactType = {
    Github: 'Github',
    LinkedIn: 'LinkedIn',
} as const;

export type ContactType = typeof ContactType[keyof typeof ContactType];

export interface ContactItem {
    type: ContactType;
    text: string;
    href?: string;
}

export interface ContactValue {
    Icon: ((props: IconProps) => ReactNode) | ((props: SVGProps<SVGSVGElement>) => ReactNode);
    srLabel: string;
}

export interface Social {
    label: string;
    Icon: (props: IconProps) => ReactNode;
    href: string;
}
