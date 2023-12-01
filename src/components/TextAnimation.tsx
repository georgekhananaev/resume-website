/* eslint-disable */

import React from 'react';
import {TypeAnimation} from 'react-type-animation';

const TextAnimation = () => {
    return (

        <TypeAnimation
            sequence={[
                "I specialize as a Python Full Stack Developer.",
                2000,
                'Proficient in coding with ReactJS, JavaScript, TypeScript',
                3000,
                'Certainly adept in HTML, CSS, SASS, and contemporary design frameworks.',
                4000,
                () => {
                    console.log('Done typing!');
                }
            ]}
            wrapper="div"
            cursor={true}
            repeat={Infinity}
            omitDeletionAnimation={false}
            className={"before:content-['Resume-Website/']"}

            //   style={{ fontSize: '15px' }}
        />


    );
};


export default TextAnimation;
