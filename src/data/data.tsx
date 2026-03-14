import {
    AcademicCapIcon,
    BuildingOfficeIcon,
    CalendarIcon,
    FlagIcon,
    MapIcon,
    SparklesIcon,
} from '@heroicons/react/24/outline';

import GithubIcon from '../components/Icon/GithubIcon';
import LinkedInIcon from '../components/Icon/LinkedInIcon';
import TextAnimation from '../components/TextAnimation';
import awsPic from '../images/favtech/aws.webp';
import mondayPic from '../images/favtech/monday.webp';
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
import applePic from '../images/favtech/apple.webp';
import claudePic from '../images/favtech/claude.webp';
import cloudflarePic from '../images/favtech/cloudflare.webp';
import firebasePic from '../images/favtech/firebase.webp';
import gcloudPic from '../images/favtech/gcloud.webp';
import geminiPic from '../images/favtech/gemini.webp';
import linuxPic from '../images/favtech/linux.webp';
import nginxPic from '../images/favtech/nginx.webp';
import nodejsPic from '../images/favtech/nodejs.webp';
import ollamaPic from '../images/favtech/ollama.webp';
import postgresqlPic from '../images/favtech/postgresql.webp';
import pydanticPic from '../images/favtech/pydantic.webp';
import redisPic from '../images/favtech/redis.webp';
import swiftPic from '../images/favtech/swift.webp';
import tailwindPic from '../images/favtech/tailwind.webp';
import twilioPic from '../images/favtech/twilio.webp';
import typescriptPic from '../images/favtech/typescript.webp';
import vercelPic from '../images/favtech/vercel.webp';
import vscodePic from '../images/favtech/vscode.webp';
import ansiblePic from '../images/favtech/ansible.webp';
import css3Pic from '../images/favtech/css3.webp';
import elasticsearchPic from '../images/favtech/elasticsearch.webp';
import figmaPic from '../images/favtech/figma.webp';
import grafanaPic from '../images/favtech/grafana.webp';
import html5Pic from '../images/favtech/html5.webp';
import jwtPic from '../images/favtech/jwt.webp';
import kubernetesPic from '../images/favtech/kubernetes.webp';
import letsencryptPic from '../images/favtech/letsencrypt.webp';
import playwrightPic from '../images/favtech/playwright.webp';
import prometheusPic from '../images/favtech/prometheus.webp';
import proxmoxPic from '../images/favtech/proxmox.webp';
import pytestPic from '../images/favtech/pytest.webp';
import rabbitmqPic from '../images/favtech/rabbitmq.webp';
import sassPic from '../images/favtech/sass.webp';
import seleniumPic from '../images/favtech/selenium.webp';
import stripePic from '../images/favtech/stripe.webp';
import terraformPic from '../images/favtech/terraform.webp';
import traefikPic from '../images/favtech/traefik.webp';
import websocketPic from '../images/favtech/websocket.webp';
import xcodePic from '../images/favtech/xcode.webp';
import n8nPic from '../images/favtech/n8n.webp';
import homebrewPic from '../images/favtech/homebrew.webp';
import framermotionPic from '../images/favtech/framermotion.webp';
import dragonflyPic from '../images/favtech/dragonfly.webp';
import htmxPic from '../images/favtech/htmx.webp';
import jupyterPic from '../images/favtech/jupyter.webp';
import supabasePic from '../images/favtech/supabase.webp';
import kamateraPic from '../images/favtech/kamatera.webp';
import heroImage from '../images/header-background.webp';
import claudeSkillsVault from '../images/portfolio/claude-skills-vault.svg';
import darkthemeAuthFastapi from '../images/portfolio/darktheme-auth-fastapi.svg';
import excelAiAssistant from '../images/portfolio/excel-ai-assistant.svg';
import fastapiDocshield from '../images/portfolio/fastapi-docshield.svg';
import googleReviewsScraper from '../images/portfolio/google-reviews-scraper-pro.svg';
import pyImageCompressor from '../images/portfolio/py-image-compressor.svg';
import pynextstack from '../images/portfolio/pynextstack.svg';
import sparkClean from '../images/portfolio/spark-clean.svg';
import profilePic from '../images/profilepic.jpg';
import testimonialImage from '../images/testimonial.webp';
import {
    About,
    ContactSection,
    ContactType,
    FavoriteTechItem,
    Hero,
    PortfolioItem,
    SkillGroup,
    Social,
    TestimonialSection,
    TimelineItem,
} from './dataDef';

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
    FavoriteTech: "favoritetech",
    Github: "github",

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
                Israel based <strong className="text-sky-500">Full Stack Developer </strong> & <strong className="text-sky-200">Python</strong> enthusiast. <br></br> Currently
                working at <strong className="text-sky-200">Moon Holidays</strong> as Head of Development.
            </p>


            <div className='lg:flex-row text-left bg-black w-4/5 p-2 rounded-lg'>
                <div className='text-stone-300'><TextAnimation/></div>
            </div>
        </>
    ),
    actions: [
        {
            href: '/api/resume',
            text: 'Download Resume',
            primary: true,
        },
        {
            href: `#${SectionId.Contact}`,
            text: 'Contact',
            primary: false,
        },
    ],
};

function calcAge(): string {
    const bd = process.env.BIRTH_DATE;
    if (!bd) return '';
    const birth = new Date(bd);
    const today = new Date();
    let age = today.getFullYear() - birth.getFullYear();
    const m = today.getMonth() - birth.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) age--;
    return String(age);
}

/**
 * About section
 */
export const aboutData: About = {
    profileImageSrc: profilePic,
    description: `Full Stack Developer working across Python, TypeScript, and Swift, building enterprise-grade systems designed for scale. In the AI era, my focus has shifted from writing every line of code to architecting solutions that combine user experience, performance, and security at the highest level. I design multi-tenant platforms, real-time data pipelines, and AI-driven applications for corporations, not individuals. Every project I take on is built with scale, reliability, and long-term maintainability in mind. Beyond tech, I've explored over 50 countries and picked up the art of Japanese cuisine along the way.`,
    aboutItems: [
        {label: 'Location', text: 'Bangkok, Thailand', Icon: MapIcon},
        {label: 'Age', text: calcAge(), Icon: CalendarIcon},
        {label: 'Nationality', text: 'Israeli', Icon: FlagIcon},
        {label: 'Interests', text: 'Development, Technology, Cooking', Icon: SparklesIcon},
        {label: 'Study', text: 'HackerU College, Israel', Icon: AcademicCapIcon},
        {label: 'Employment', text: 'Moon Holidays, Head of Development', Icon: BuildingOfficeIcon},
    ],
};

/**
 * Skills section
 */
export const skills: SkillGroup[] = [
    {
        name: 'AI & LLMs',
        skills: [
            {name: 'Claude Code / Codex CLI / Gemini CLI', level: 10},
            {name: 'OpenAI API / Ollama', level: 9},
            {name: 'LLM Integration', level: 9},
            {name: 'Prompt Engineering', level: 9},
        ],
    },
    {
        name: 'Full Stack Development',
        skills: [
            {name: 'Python / FastAPI', level: 10},
            {name: 'TypeScript / Next.js / React', level: 9},
            {name: 'Swift / macOS & iOS', level: 7},
            {name: 'Node.js / Express', level: 8},
        ],
    },
    {
        name: 'Architecture & Infrastructure',
        skills: [
            {name: 'System Design / Multi-Tenant', level: 9},
            {name: 'Docker / CI-CD / Cloud', level: 9},
            {name: 'Database Design (SQL / NoSQL)', level: 9},
            {name: 'Security & Performance', level: 9},
        ],
    },
    {
        name: 'Product & Design',
        skills: [
            {name: 'UI/UX Design', level: 8},
            {name: 'Responsive & Mobile-First', level: 9},
            {name: 'REST / GraphQL API Design', level: 9},
            {name: 'Agile / Technical Leadership', level: 8},
        ],
    },
    {
        name: 'Spoken Languages',
        skills: [
            {name: 'Hebrew', level: 10},
            {name: 'Russian', level: 9},
            {name: 'English', level: 9},
            {name: 'Thai', level: 1},
        ],
    },
    {
        name: 'DevOps & Tools',
        skills: [
            {name: 'Git / GitHub Actions', level: 9},
            {name: 'Linux / SSH / Shell', level: 9},
            {name: 'AWS / Oracle / Google Cloud', level: 9},
            {name: 'Monitoring / Logging', level: 8},
        ],
    },
];

/**
 * Portfolio section
 */
export const portfolioItems: PortfolioItem[] = [
    {
        title: 'Google Reviews Scraper Pro',
        description: 'A powerful Google Maps review scraper that extracts multi-language reviews with images, handles MongoDB integration, and bypasses detection. Features incremental scraping, image downloading, and URL replacement.',
        url: 'https://github.com/georgekhananaev/google-reviews-scraper-pro',
        image: googleReviewsScraper,
        stars: 134,
    },
    {
        title: 'Excel AI Assistant',
        description: 'A Python desktop application that enhances Excel and CSV files using AI transformations. Features dual AI backends (OpenAI API and local Ollama), customizable prompt templates, and batch processing.',
        url: 'https://github.com/georgekhananaev/excel-ai-assistant',
        image: excelAiAssistant,
        stars: 61,
    },
    {
        title: 'py-image-compressor',
        description: 'Efficient software for swift compression, conversion, and resizing of multiple images simultaneously. Supports modern formats like WebP.',
        url: 'https://github.com/georgekhananaev/py-image-compressor',
        image: pyImageCompressor,
        stars: 36,
    },
    {
        title: 'PyNextStack',
        description: 'Full-Stack User Management System with Next.js frontend and FastAPI backend. Features registration, authentication, profile management, and Material-UI interface.',
        url: 'https://github.com/georgekhananaev/PyNextStack',
        image: pynextstack,
        stars: 25,
    },
    {
        title: 'Spark Clean',
        description: 'Free, open-source macOS storage and cache cleaner built for developers. Scans Docker, Xcode, Node.js, Ollama, JetBrains, Homebrew, and more.',
        url: 'https://github.com/georgekhananaev/spark-clean',
        image: sparkClean,
        stars: 16,
    },
    {
        title: 'FastAPI DocShield',
        description: 'A simple FastAPI integration to protect documentation endpoints with HTTP Basic Authentication.',
        url: 'https://github.com/georgekhananaev/fastapi-docshield',
        image: fastapiDocshield,
        stars: 13,
    },
    {
        title: 'Claude Skills Vault',
        description: 'A curated collection of high-impact skills for Claude Code designed to supercharge the senior full-stack workflow. Automates architectural reviews, TDD cycles, and PR management.',
        url: 'https://github.com/georgekhananaev/claude-skills-vault',
        image: claudeSkillsVault,
        stars: 10,
    },
    {
        title: 'Dark Theme Auth FastAPI Server',
        description: 'A versatile FastAPI server template with authentication-protected endpoints, Redis caching, comprehensive logging, and a custom dark theme for API documentation.',
        url: 'https://github.com/georgekhananaev/darktheme-auth-fastapi-server',
        image: darkthemeAuthFastapi,
        stars: 10,
    },
];

/**
 * FavoriteTechItem section
 */
export const FavoriteTechItems: FavoriteTechItem[] = [
    // AI & LLMs
    {title: 'Claude', image: claudePic, category: 'AI & LLMs'},
    {title: 'OpenAI', image: openAiPic, category: 'AI & LLMs'},
    {title: 'Gemini', image: geminiPic, category: 'AI & LLMs'},
    {title: 'Ollama', image: ollamaPic, category: 'AI & LLMs'},
    // Languages & Runtimes
    {title: 'Python', image: pythonPic, category: 'Languages'},
    {title: 'TypeScript', image: typescriptPic, category: 'Languages'},
    {title: 'JavaScript', image: javascriptPic, category: 'Languages'},
    {title: 'Swift', image: swiftPic, category: 'Languages'},
    {title: 'Node.js', image: nodejsPic, category: 'Languages'},
    {title: 'HTML5', image: html5Pic, category: 'Languages'},
    {title: 'CSS3', image: css3Pic, category: 'Languages'},
    {title: 'Sass', image: sassPic, category: 'Languages'},
    // Frameworks & Libraries
    {title: 'FastAPI', image: fastApiPic, category: 'Frameworks'},
    {title: 'Next.js', image: nextJsPic, category: 'Frameworks'},
    {title: 'React', image: reactPic, category: 'Frameworks'},
    {title: 'Tailwind CSS', image: tailwindPic, category: 'Frameworks'},
    {title: 'Pydantic', image: pydanticPic, category: 'Frameworks'},
    {title: 'MUI', image: muiPic, category: 'Frameworks'},
    {title: 'HTMX', image: htmxPic, category: 'Frameworks'},
    {title: 'Framer Motion', image: framermotionPic, category: 'Frameworks'},
    // Databases & Messaging
    {title: 'MongoDB', image: mongoDB, category: 'Databases'},
    {title: 'MySQL', image: mysqlPic, category: 'Databases'},
    {title: 'PostgreSQL', image: postgresqlPic, category: 'Databases'},
    {title: 'Redis', image: redisPic, category: 'Databases'},
    {title: 'Dragonfly', image: dragonflyPic, category: 'Databases'},
    {title: 'Elasticsearch', image: elasticsearchPic, category: 'Databases'},
    {title: 'Supabase', image: supabasePic, category: 'Databases'},
    {title: 'RabbitMQ', image: rabbitmqPic, category: 'DevOps'},
    {title: 'WebSocket', image: websocketPic, category: 'Frameworks'},
    {title: 'GraphQL', image: graphQLPic, category: 'Frameworks'},
    // Cloud & Hosting
    {title: 'Docker', image: dockerPic, category: 'Cloud'},
    {title: 'AWS', image: awsPic, category: 'Cloud'},
    {title: 'Google Cloud', image: gcloudPic, category: 'Cloud'},
    {title: 'Oracle Cloud', image: oraclePic, category: 'Cloud'},
    {title: 'Cloudflare', image: cloudflarePic, category: 'Cloud'},
    {title: 'Vercel', image: vercelPic, category: 'Cloud'},
    {title: 'Netlify', image: netlifyPic, category: 'Cloud'},
    {title: 'Firebase', image: firebasePic, category: 'Cloud'},
    {title: 'Kubernetes', image: kubernetesPic, category: 'Cloud'},
    {title: 'Proxmox', image: proxmoxPic, category: 'Cloud'},
    {title: 'Kamatera', image: kamateraPic, category: 'Cloud'},
    // DevOps & Infrastructure
    {title: 'Nginx', image: nginxPic, category: 'DevOps'},
    {title: 'Traefik', image: traefikPic, category: 'DevOps'},
    {title: 'Terraform', image: terraformPic, category: 'DevOps'},
    {title: 'Ansible', image: ansiblePic, category: 'DevOps'},
    {title: 'Grafana', image: grafanaPic, category: 'DevOps'},
    {title: 'Prometheus', image: prometheusPic, category: 'DevOps'},
    {title: 'Git', image: gitPic, category: 'DevOps'},
    {title: 'GitHub', image: githubPic, category: 'DevOps'},
    {title: 'Linux', image: linuxPic, category: 'DevOps'},
    {title: 'Ubuntu', image: ubuntuPic, category: 'DevOps'},
    {title: 'SSH', image: sshPic, category: 'DevOps'},
    {title: 'VMware', image: vmwarePic, category: 'DevOps'},
    // Security & Auth
    {title: 'JWT', image: jwtPic, category: 'Security'},
    {title: "Let's Encrypt", image: letsencryptPic, category: 'Security'},
    // APIs & Services
    {title: 'Stripe', image: stripePic, category: 'Services'},
    {title: 'Twilio', image: twilioPic, category: 'Services'},
    // Testing
    {title: 'Pytest', image: pytestPic, category: 'Testing'},
    {title: 'Selenium', image: seleniumPic, category: 'Testing'},
    {title: 'Playwright', image: playwrightPic, category: 'Testing'},
    // Tools & IDEs
    {title: 'JetBrains', image: jetbrainPic, category: 'Tools'},
    {title: 'VS Code', image: vscodePic, category: 'Tools'},
    {title: 'Xcode', image: xcodePic, category: 'Tools'},
    {title: 'Jupyter', image: jupyterPic, category: 'Tools'},
    {title: 'Figma', image: figmaPic, category: 'Tools'},
    {title: 'Monday', image: mondayPic, category: 'Tools'},
    {title: 'n8n', image: n8nPic, category: 'Tools'},
    {title: 'macOS / iOS', image: applePic, category: 'Tools'},
    {title: 'Home Assistant', image: haPic, category: 'Tools'},
    {title: 'Homebrew', image: homebrewPic, category: 'Tools'},
];

/**
 * Resume section
 */
export const education: TimelineItem[] = [
    {
        date: '2022-2023',
        location: 'HackerU College',
        title: 'Java, OCA',
        content: <p>Pursuing advanced studies in Java Full-Stack with a specialized emphasis on mobile applications
            development. Integrating cutting-edge frameworks and methodologies to cultivate a contemporary and versatile
            skill set.</p>,
    },
    {
        date: '2020',
        location: 'CampusIL',
        title: 'Python Course',
        content: <p>Proficient in Python, with advanced expertise in utilizing libraries such as Pandas, NumPy,
            Requests, Flask, and other sophisticated tools to enhance programming capabilities.


        </p>,
    },
];

export const experience: TimelineItem[] = [
    {
        date: 'Mid 2025 - Present',
        location: 'Moon Holidays, Bangkok',
        title: 'Head of Development & IT Infrastructure',
        content: (
            <ul className='ml-5 list-disc'>
                <li>Leading the full engineering organization, overseeing architecture, development, and
                    infrastructure across all company platforms and products.
                </li>
                <li>Expanding the platform ecosystem with B2B partner portal (travelpanel-b2b-nextjs),
                    StaySync hotel integration system, and new client-facing products scheduled for 2026.
                </li>
                <li>Driving technical strategy, DevOps practices, cloud infrastructure, and security
                    standards across the organization.
                </li>
            </ul>
        ),
    },
    {
        date: 'Dec 2024 - Mid 2025',
        location: 'Moon Holidays, Bangkok',
        title: 'Engineering Team Lead',
        content: (
            <ul className='ml-5 list-disc'>
                <li>Promoted to lead the engineering team, managing developers and coordinating delivery
                    across multiple products simultaneously.
                </li>
                <li>Architected and shipped Support Hub, Travel Offer booking engine, Live Deck
                    presentation system, real-time WebSocket server for notifications and chat,
                    and a Vercel deployment controller with async job processing.
                </li>
                <li>Established microservices architecture patterns, code review processes, and
                    deployment pipelines used across the team.
                </li>
            </ul>
        ),
    },
    {
        date: 'Dec 2022 - Dec 2024',
        location: 'Moon Holidays, Bangkok',
        title: 'Full Stack Developer',
        content: (
            <ul className='ml-5 list-disc'>
                <li>Designed and built Travel Panel from scratch, a multi-tenant enterprise platform
                    using FastAPI (Python) and Next.js (TypeScript), covering both the core API
                    (travelpanel-fastapi) and client portal (travelpanel-nextjs).
                </li>
                <li>Integrated dozens of external APIs including Agoda, Booking.com, Google Cloud,
                    Cloudflare, Twilio, Firebase, and real-time currency exchange services.
                </li>
                <li>Built infrastructure-agnostic deployments using Docker, Dragonfly (Redis alternative),
                    NoSQL databases, and queue-based async architecture.
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
        {
            name: 'Zahi Bella',
            text: "George is a true leader and an exceptionally talented developer who consistently thinks outside the box. He approaches every challenge with creativity and delivers results that exceed expectations. His drive for performance and excellence sets him apart.",
            image: '/testimonials/zahi.webp',
            alt: "Zahi Bella - CEO of Moon Holidays",
        },
        {
            name: 'Lior R.',
            text: "One of the most talented and dedicated people I've ever worked with. George brings a rare combination of deep technical skill and genuine commitment to every project. He doesn't just write code, he solves problems and makes sure everything works flawlessly.",
            image: '/testimonials/lior.webp',
            alt: "Lior R.",
        },
    ],
};

/**
 * Contact section
 */

export const contact: ContactSection = {
    headerText: 'Get in touch.',
    description: 'Available for remote opportunities and open to collaborations. For faster responses on serious inquiries, include your WhatsApp number and I will reach out directly. Email responses may take a few days.',
    items: [
        {
            type: ContactType.Github,
            text: 'github.com/georgekhananaev',
            href: 'https://github.com/georgekhananaev',
        },
        {
            type: ContactType.LinkedIn,
            text: 'linkedin.com/in/georgekhananaev',
            href: 'https://www.linkedin.com/in/georgekhananaev/',
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
