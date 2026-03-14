'use client';

import clsx from 'clsx';
import Image from 'next/image';
import {UIEventHandler, useCallback, useEffect, useMemo, useRef, useState} from 'react';

import {isApple, isMobile} from '../../config';
import {SectionId, testimonial} from '../../data/data';
import type {Testimonial} from '../../data/dataDef';
import useInterval from '../../hooks/useInterval';
import useWindow from '../../hooks/useWindow';
import QuoteIcon from '../Icon/QuoteIcon';
import Section from '../Layout/Section';

export default function Testimonials() {
    const [activeIndex, setActiveIndex] = useState<number>(0);
    const [scrollValue, setScrollValue] = useState(0);
    const [parallaxEnabled, setParallaxEnabled] = useState(false);

    const itemWidth = useRef(0);
    const scrollContainer = useRef<HTMLDivElement>(null);

    const {width} = useWindow();

    const {imageSrc, testimonials} = testimonial;

    const resolveSrc = useMemo(() => {
        if (!imageSrc) return undefined;
        return typeof imageSrc === 'string' ? imageSrc : imageSrc.src;
    }, [imageSrc]);

    useEffect(() => {
        setParallaxEnabled(!(isMobile && isApple));
    }, []);

    useEffect(() => {
        itemWidth.current = scrollContainer.current ? scrollContainer.current.offsetWidth : 0;
    }, [width]);

    useEffect(() => {
        if (scrollContainer.current) {
            const newIndex = Math.round(scrollContainer.current.scrollLeft / itemWidth.current);
            setActiveIndex(newIndex);
        }
    }, [itemWidth, scrollValue]);

    const setTestimonial = useCallback(
        (index: number) => () => {
            if (scrollContainer !== null && scrollContainer.current !== null) {
                scrollContainer.current.scrollLeft = itemWidth.current * index;
            }
        },
        [],
    );
    const next = useCallback(() => {
        if (activeIndex + 1 === testimonials.length) {
            setTestimonial(0)();
        } else {
            setTestimonial(activeIndex + 1)();
        }
    }, [activeIndex, setTestimonial, testimonials.length]);

    const handleScroll = useCallback<UIEventHandler<HTMLDivElement>>(event => {
        setScrollValue(event.currentTarget.scrollLeft);
    }, []);

    useInterval(next, 20000);

    if (!testimonials.length) {
        return null;
    }

    return (
        <Section noPadding sectionId={SectionId.Testimonials}>
            <div
                className={clsx(
                    'flex w-full items-center justify-center bg-cover bg-center px-4 py-10 sm:px-6 sm:py-16 md:py-24 lg:px-8',
                    parallaxEnabled && 'bg-fixed',
                    {'bg-neutral-700': !imageSrc},
                )}
                style={imageSrc ? {backgroundImage: `url(${resolveSrc}`} : undefined}>
                <div className="z-10 w-full max-w-screen-md">
                    <div className="flex flex-col items-center gap-y-4 rounded-xl bg-gray-800/60 p-4 shadow-lg sm:gap-y-6 sm:p-6">
                        <div
                            className="no-scrollbar flex w-full touch-pan-x snap-x snap-mandatory gap-x-6 overflow-x-auto scroll-smooth"
                            onScroll={handleScroll}
                            ref={scrollContainer}>
                            {testimonials.map((testimonialItem, index) => {
                                const isActive = index === activeIndex;
                                return (
                                    <TestimonialCard isActive={isActive} key={`${testimonialItem.name}-${index}`}
                                                 testimonial={testimonialItem} />
                                );
                            })}
                        </div>
                        <div className="flex gap-x-4">
                            {[...Array(testimonials.length)].map((_, index) => {
                                const isActive = index === activeIndex;
                                return (
                                    <button
                                        className={clsx(
                                            'h-3 w-3 rounded-full bg-gray-300 transition-all duration-500 sm:h-4 sm:w-4',
                                            isActive ? 'scale-100 opacity-100' : 'scale-75 opacity-60',
                                        )}
                                        disabled={isActive}
                                        key={`select-button-${index}`}
                                        onClick={setTestimonial(index)}
                                        aria-label={`Go to testimonial ${index + 1}`}
                                        title={`Testimonial ${index + 1}`} />
                                );
                            })}
                        </div>
                    </div>
                </div>
            </div>
        </Section>
    );
}

function TestimonialCard({testimonial: {text, name, image, alt}, isActive}: {testimonial: Testimonial; isActive: boolean}) {
    return (
        <div
            className={clsx(
                'flex w-full shrink-0 snap-start snap-always flex-col items-start gap-y-4 p-2 transition-opacity duration-1000 sm:flex-row sm:gap-x-6',
                isActive ? 'opacity-100' : 'opacity-0',
            )}>
            {image ? (
                <div className="relative h-14 w-14 shrink-0 sm:h-16 sm:w-16">
                    <QuoteIcon className="absolute -left-2 -top-2 h-4 w-4 stroke-black text-white" />
                    <Image alt={alt} className="rounded-full" height={64} src={image} width={64} />
                </div>
            ) : (
                <QuoteIcon className="h-5 w-5 shrink-0 text-white sm:h-8 sm:w-8" />
            )}
            <div className="flex flex-col gap-y-4">
                <p className="prose prose-sm font-medium italic text-white sm:prose-base">{text}</p>
                <p className="text-xs italic text-white sm:text-sm md:text-base lg:text-lg">-- {name}</p>
            </div>
        </div>
    );
}
