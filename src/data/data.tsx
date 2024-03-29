import '@fortawesome/fontawesome-free/css/all.min.css';

import {
    AcademicCapIcon,
    CalendarIcon,
    DownloadIcon,
    FlagIcon,
    MapIcon,
    OfficeBuildingIcon,
    SparklesIcon,
} from '@heroicons/react/outline';

import GithubIcon from '../components/Icon/GithubIcon';
import LinkedInIcon from '../components/Icon/LinkedInIcon';
import TextAnimation from '../components/TextAnimation'
import awsPic from '../images/favtech/aws.webp';
import clickUpPic from '../images/favtech/clickup.webp';
import dockerPic from '../images/favtech/docker.webp';
import fastApiPic from '../images/favtech/fastapi.webp';
import gitPic from '../images/favtech/git.webp';
import githubPic from '../images/favtech/github.webp';
import graphQLPic from '../images/favtech/graph_ql.webp';
import haPic from '../images/favtech/homeassistant.webp';
import jetbrainPic from '../images/favtech/jetbrain.webp';
import javascriptPic from '../images/favtech/js.webp';
import mongoDB from '../images/favtech/mongoDB.webp';
import muiPic from '../images/favtech/mui.webp';
import mysqlPic from '../images/favtech/mysql.webp';
import netlifyPic from '../images/favtech/netlify.webp';
import nextJsPic from '../images/favtech/nextjs.webp';
import openAiPic from '../images/favtech/open_ai.webp';
import oraclePic from '../images/favtech/oracle.webp';
import pythonPic from '../images/favtech/python.webp';
import reactPic from '../images/favtech/react-js.webp';
import sshPic from '../images/favtech/ssh.webp';
import ubuntuPic from '../images/favtech/ubuntu.webp';
import vmwarePic from '../images/favtech/vmware.webp';
import heroImage from '../images/header-background.webp';
import mediaRobot from '../images/portfolio/mediarobot.webp';
import pyImageCompressor from '../images/portfolio/py-impage-compressor.webp';
import resumeWebsite from '../images/portfolio/resume_website.webp';
import topTen from '../images/portfolio/top10.webp';
import profilePic from '../images/profilepic.jpg';
import testimonialImage from '../images/testimonial.webp';

import {
    About,
    ContactSection,
    ContactType,
    FavoriteTechItem,
    Hero,
    HomepageMeta,
    PortfolioItem,
    SkillGroup,
    Social,
    TestimonialSection,
    TimelineItem,
} from './dataDef';

/**
 * Page meta data
 */
export const homePageMeta: HomepageMeta = {
    title: 'George Khananaev',
    description: "Results-oriented developer with extensive expertise in developing ecommerce automations and comprehensive Python-based business applications. Known for innovative thinking, consistently introducing fresh ideas and enhancements to drive project success.",
    image: "/george_khanaanev_profile.webp",
};

/**
 * Section definition
 */
export const SectionId = {
    Hero: 'hero',
    About: 'about',
    Contact: 'contact',
    Portfolio: 'portfolio',
    Resume: 'resume',
    Skills: 'skills',
    Stats: 'stats',
    Testimonials: 'testimonials',
    FavoriteTech: "favoritetech"

} as const;

export type SectionId = typeof SectionId[keyof typeof SectionId];

/**
 * Hero section
 */
export const heroData: Hero = {
    imageSrc: heroImage,
    name: `George Khananaev`,
    description: (
        <>
            <p className="prose-sm text-stone-50 sm:prose-base lg:prose-lg">
                Israel based <strong className="text-sky-500">Full Stack Developer </strong> & <i
                className="text-sky-200 fa-brands fa-python"> Python</i> enthusiast. <br></br> Currently
                working at <strong className="text-sky-200">Moon Holidays</strong> as a Full Stack Developer & IT
                Manager.
            </p>


            <div className='lg:flex-row text-left bg-black w-4/5 p-2 rounded-lg'>
                <div className='text-stone-300'><TextAnimation/></div>
            </div>

            {/* <p className="prose-sm text-stone-300 sm:prose-base">
        
         <i className="text-yellow-500 fa-regular fa-face-laugh-wink"></i>
      </p> */}
        </>
    ),
    actions: [
        {
            href: 'https://drive.google.com/file/d/1LJCYke8E7Tih2iHRmxVeTjhIBWSxWPMk/view?usp=sharing',
            text: 'Resume',
            primary: true,
            Icon: DownloadIcon,
        },
        {
            href: `#${SectionId.Contact}`,
            text: 'Contact',
            primary: false,
        },
    ],
};

/**
 * About section
 */
export const aboutData: About = {
    profileImageSrc: profilePic,
    description: `
I am a dedicated software developer boasting extensive experience in e-commerce automations and diverse Python-based business applications. Renowned for my non-traditional approach, I consistently introduce innovative ideas and enhancements to projects. Interestingly, beyond the realm of coding, I harbor a passion for globetrotting, having explored over 50 countries to date. Of all my travels, Japan left an indelible mark on me, capturing my heart with its rich culture and delectable cuisine. Motivated by this profound connection, I decided to channel my enthusiasm into a culinary pursuit. Delving into the intricacies of Japanese culture, I undertook the challenge of mastering the art of Japanese cuisine. Today, in addition to my role as a software developer, I take pride in my secret identity as a skilled sushi chef`,
    aboutItems: [
        {label: 'Location', text: 'Center, Israel', Icon: MapIcon},
        {label: 'Age', text: '35', Icon: CalendarIcon},
        {label: 'Nationality', text: 'Israeli', Icon: FlagIcon},
        {label: 'Interests', text: 'Development, Technology, Cooking', Icon: SparklesIcon},
        {label: 'Study', text: 'HackerU Collage, Israel', Icon: AcademicCapIcon},
        {label: 'Employment', text: 'Moon Holidays, Remote Developer', Icon: OfficeBuildingIcon},
    ],
};

/**
 * Skills section
 */
export const skills: SkillGroup[] = [
    {
        name: 'Spoken languages',
        skills: [
            {
                name: 'English',
                level: 8,
            },
            {
                name: 'Hebrew',
                level: 10,
            },
            {
                name: 'Russian',
                level: 9,
            },
        ],
    },
    {
        name: 'Frontend development',
        skills: [
            {
                name: 'React',
                level: 9,
            },
            {
                name: 'JavaScript',
                level: 9,
            },
            {
                name: 'Typescript',
                level: 6,
            },

        ],
    },
    {
        name: 'Backend development',
        skills: [
            {
                name: 'Python',
                level: 9.5,
            }
        ],
    },
    {
        name: 'Mobile development',
        skills: [
            {
                name: 'React Native',
                level: 7,
            }
        ],
    },
];

/**
 * Portfolio section
 */
export const portfolioItems: PortfolioItem[] = [
    {
        title: 'Top10',
        description: 'React, Python, MySql based AI websites engine that building itself automatically. Building it own content, graphics, articles and also promoting it own content by google ads and self managing promoted campaigns based on statistics and income.',
        url: 'https://github.com/georgekhananaev',
        image: topTen,
    },
    {
        title: 'MediaRobot',
        description: "Pure Python Bot. Which is extracting fresh data from marketplaces such as AliExpress and Amazon and then creating video based reviews. All videos uploaded by API to YouTube. Driving affiliated traffic and creating income automatically. Click Here for Video Sample.",
        url: 'https://www.youtube.com/watch?v=PeguOBRrJXM',
        image: mediaRobot,
    },
    {
        title: 'Resume Website',
        description: "This is my personal resume website. React, JS, TYPESCRIPT based. It based on open source code, however many key features added and fixed by me. More features will be added... Click Here for Source Code.",
        url: 'https://github.com/georgekhananaev/resume-website',
        image: resumeWebsite,
    },
    {
        title: 'py-image-compressor',
        description: "Open-Source small weight Python based tool. This tool convert multiple images at once to modern formats such as webp. Can speed up any website with a single command.",
        url: 'https://github.com/georgekhananaev/py-image-compressor',
        image: pyImageCompressor,
    },

];

/**
 * FavoriteTechItem section
 */
export const FavoriteTechItems: FavoriteTechItem[] = [
    {
        title: 'OpenAI',
        image: openAiPic,
    },
    {
        title: 'Python 3+',
        image: pythonPic,
    },
    {
        title: 'Fast API',
        image: fastApiPic,
    },
    {
        title: 'GitHub',
        image: githubPic,
    },
    {
        title: 'Git',
        image: gitPic,
    },
    {
        title: 'AWS',
        image: awsPic,
    },
    {
        title: 'Ubuntu',
        image: ubuntuPic,
    },
    {
        title: 'Home Assistant',
        image: haPic,
    },
    {
        title: "vmware",
        image: vmwarePic,
    },
    {
        title: 'Oracle Cloud',
        image: oraclePic,
    },
    {
        title: 'SSH',
        image: sshPic,
    },
    {
        title: 'Docker',
        image: dockerPic,
    },
    {
        title: 'MySql/SQL',
        image: mysqlPic,
    },
    {
        title: 'mongoDB',
        image: mongoDB,
    },
    {
        title: "JetBrain IDE",
        image: jetbrainPic,
    },
    {
        title: 'ClickUp',
        image: clickUpPic,
    },
    {
        title: 'GraphQL',
        image: graphQLPic,
    },
    {
        title: 'JavaScript',
        image: javascriptPic,
    },
    {
        title: 'React',
        image: reactPic,
    },
    {
        title: 'NextJS',
        image: nextJsPic,
    },
    {
        title: 'Mui Framework',
        image: muiPic,
    },
    {
        title: 'Netlify',
        image: netlifyPic,
    },
];

/**
 * Resume section -- TODO: Standardize resume contact format or offer MDX
 */
export const education: TimelineItem[] = [
    {
        date: '2022-2023',
        location: 'HackerU Collage',
        title: 'Java, OCA',
        content: <p>Pursuing advanced studies in Java Full-Stack with a specialized emphasis on mobile applications
            development. Integrating cutting-edge frameworks and methodologies to cultivate a contemporary and versatile
            skill set.</p>,
    },
    {
        date: '2020-2020',
        location: 'CampusIL',
        title: 'Python Course',
        content: <p>Proficient in Python, with advanced expertise in utilizing libraries such as Pandas, NumPy,
            Requests, Flask, and other sophisticated tools to enhance programming capabilities.


        </p>,
    },
];

export const experience: TimelineItem[] = [
    {
        date: 'Dec 2022 - Present',
        location: 'Moon Holidays, Bangkok',
        title: 'Full Stack Developer & IT Manager.',
        content: (
            <ul className='ml-5 list-disc'>
                <li>As an IT Manager, I am dedicated to ensuring the security, reliability, and scalability of our
                    organization's IT systems. My role involves strategically planning and implementing technologies and
                    systems to enhance the overall efficiency and effectiveness of our operations. Beyond my core
                    responsibilities, I actively engage in strategic planning and decision-making. Collaborating closely
                    with executives and stakeholders, I ensure that our IT strategy aligns seamlessly with the broader
                    goals and objectives of the organization.
                </li>
                <li>In a span of 5 months, I successfully conceptualized and developed an entire system to manage our
                    offline contracts, attractions, hotels, and transportation services. This comprehensive system
                    involved the creation of dozens of integrations with external APIs, including Agoda, Booking.com,
                    Google Cloud, Cloudflare, Twilio, Firebase, and real-time currency exchange functionalities.
                    Constructed entirely from scratch, the system utilizes Python and React Next.js, showcasing
                    scalability and the incorporation of cutting-edge technologies. Noteworthy features include the
                    utilization of Dragonfly in place of Redis for enhanced performance and encryption measures. The
                    system is designed to be architecture-agnostic, capable of installation on any infrastructure, and
                    operates within Docker containers, utilizing a NoSQL database to ensure flexibility and efficient
                    deployment. This transformation significantly altered the way our company operates, leading to
                    increased productivity and overall efficiency. This endeavor stands as a testament to my commitment
                    to fostering innovation and efficiency within the organization.
                </li>
            </ul>
        ),
    },
    {
        date: '2019 - 2022',
        location: 'Majestier, Singapore',
        title: 'Backend Software Developer',
        content: (
            <ul className='ml-8 list-disc'>
                <li>Spearheaded the development of a Python-based backend system from inception, seamlessly
                    synchronizing data across various ecommerce platforms and marketplaces, including eBay, Shopify,
                    BigCommerce, WooCommerce, and more in real-time.
                </li>
                <li>Engineered data analysis tools, reports, and other automations using Python to enhance operational
                    efficiency.
                </li>
                <li>Proficiently utilized AWS services, including RDS, VPS, and Linux-based servers, ensuring seamless
                    integration and optimal performance.
                </li>
                <li>Nurtured strong customer relationships, actively engaging with clients to discern and address their
                    evolving business needs.
                </li>

            </ul>
        ),
    },
    {
        date: '2016 - 2019',
        location: 'Kanzezol, Israel',
        title: 'Automation and Integration Developer',
        content: (
            <ul className='ml-5 list-disc'>
                <li>Pioneered the development of Python and VBA-based automations for ecommerce stores, significantly
                    enhancing customer service efficiency by eliminating routine tasks.
                </li>
                <li>Applied data-driven decision-making to continually refine and optimize software functionality,
                    ensuring alignment with evolving business requirements.
                </li>
            </ul>
        ),
    },
];

/**
 * Testimonial section
 */
export const testimonial: TestimonialSection = {
    imageSrc: testimonialImage,
    testimonials: [
        {
            name: 'Hanan Hananaev',
            text: "Without doubt one of the most talented programmers out there.  I always go back to George when I'm out of my depth and he's never failed to deliver what I ask for. Smart, trustworthy and professional.",
            image: '/testimonials/hanan.webp',
            alt: "חנן חננייב - רב סרן במילואים ומנכל עמותה לקידום צעירים יוצאי קווקאז",
        },
        {
            name: 'Tzuriel Nimni',
            text: "I've known George for many years now, he's a very smart and talented guy. He always strives for the best in what he does, and you can be certain that he will not let you down.",
            image: '/testimonials/tzuriel.webp',
            alt: "צוריאל נימני - הנדסאי באלביט",
        },
        {
            name: 'Marina Rapaport',
            text: "Any problem, malfunction or other hardware or software related issue that so called experts can't find or refuse to handle with hundred of excuses such as: not worth it, impossible. George probably will do quickly and hassle free. Very glad that I've met him and always able to direct to him some of my challenges. For sure, one of the most talented guys I've ever met.",
            image: '/testimonials/marina.webp',
            alt: "מרינה רפפורט - לוחמת בצהל לשעבר, בעלת תואר ביחסי מדינה וחוץ ועובדת ממשלתית",
        },
    ],
};

/**
 * Contact section
 */

export const contact: ContactSection = {
    headerText: 'Get in touch.',
    description: 'Feel free to reach out to me either via email or by conveniently completing the contact form. I am also available for remote job opportunities and excited to discuss potential collaborations.',
    items: [
        {
            type: ContactType.Email,
            text: 'georgekhananaev@gmail.com',
            href: 'mailto:georgekhananaev@gmail.com',
        },
        {
            type: ContactType.Location,
            text: 'Center, Israel',
            href: 'https://www.google.com/maps/place/hadera',
        },
        {
            type: ContactType.Github,
            text: 'georgekhananaev',
            href: 'https://github.com/georgekhananaev',
        },
    ],
};

/**
 * Social items
 */
export const socialLinks: Social[] = [
    {label: 'Github', Icon: GithubIcon, href: 'https://github.com/georgekhananaev'},
    {label: 'LinkedIn', Icon: LinkedInIcon, href: 'https://www.linkedin.com/in/georgekhananaev/'},
];