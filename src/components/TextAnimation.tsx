'use client';

import {TypeAnimation} from 'react-type-animation';

export default function TextAnimation() {
    return (
        <TypeAnimation
            className={"before:content-['Resume-Website/']"}
            cursor={true}
            omitDeletionAnimation={false}
            repeat={Infinity}
            sequence={[
                "I specialize as a Python Full Stack Developer.",
                2000,
                'Proficient in coding with ReactJS, JavaScript, TypeScript',
                3000,
                'Certainly adept in HTML, CSS, SASS, and contemporary design frameworks.',
                4000,
            ]}
            wrapper="div"
        />
    );
}
