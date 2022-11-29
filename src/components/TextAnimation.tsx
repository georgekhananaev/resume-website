/* eslint-disable */

import React from 'react';
import {TypeAnimation} from 'react-type-animation';

const TextAnimation = () => {
    return (

        <TypeAnimation
            sequence={[
                "I'm a Python Full Stack Developer.",
                2000,
                "That's not all.",
                1000,
                'I can code with ReactJS, JavaScript, TypeScript VBA and Java.',
                3000,
                'Of course HTML, CSS, SASS and modern design frameworks too.',
                3000,

                () => {
                    console.log('Done typing!');
                }
            ]}
            wrapper="div"
            cursor={true}
            repeat={Infinity}
            omitDeletionAnimation={false}
            className={"before:content-['React/Resume-Website/']"}

            //   style={{ fontSize: '15px' }}
        />



    );
};


export default TextAnimation;
