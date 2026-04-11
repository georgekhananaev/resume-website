import {aboutData, contact, education, experience, FavoriteTechItems, hirePitch, hireServices, portfolioItems, skills} from '../../data/data';
import {getCommercialPortfolioPosts, getPublicPortfolioPosts} from '../../lib/posts';

export const revalidate = 3600;

const siteUrl = (process.env.SITE_URL || 'https://george.khananaev.com').replace(/\/$/, '');

async function buildContent(): Promise<string> {
    const lines: string[] = [];

    // Header
    lines.push('# George Khananaev');
    lines.push('');
    lines.push('> Head of Development & IT Infrastructure at Moon Holidays, Bangkok. Also available for freelance senior engineering and tech-lead engagements.');
    lines.push('');

    // Summary from about data
    lines.push('## Summary');
    lines.push('');
    lines.push(aboutData.description);
    lines.push('');

    // Hire Me: freelance services
    lines.push('## Hire Me');
    lines.push('');
    lines.push(`**${hirePitch.tagline}**`);
    lines.push('');
    lines.push(hirePitch.summary);
    lines.push('');
    lines.push(hirePitch.availability);
    lines.push('');
    lines.push(`Dedicated page: ${siteUrl}/work-with-me`);
    lines.push('');
    lines.push('### Services offered');
    lines.push('');
    for (const svc of hireServices) {
        lines.push(`- **${svc.title}**: ${svc.description}`);
    }
    lines.push('');

    // Portfolio posts (MongoDB-backed), split into public and commercial
    try {
        const [publicPosts, commercialPosts] = await Promise.all([
            getPublicPortfolioPosts(100),
            getCommercialPortfolioPosts(100),
        ]);

        if (publicPosts.length > 0) {
            lines.push('## Public Portfolio');
            lines.push('');
            lines.push('Open-source projects on GitHub.');
            lines.push('');
            lines.push(`Browse all: ${siteUrl}/portfolio`);
            lines.push(`RSS: ${siteUrl}/portfolio/rss.xml`);
            lines.push('');
            for (const post of publicPosts) {
                const postUrl = `${siteUrl}/portfolio/${post.slug}`;
                lines.push(`### [${post.title}](${postUrl})`);
                if (post.subtitle) lines.push(`*${post.subtitle}*`);
                lines.push('');
                lines.push(post.excerpt);
                lines.push('');
                if (post.githubUrl) lines.push(`GitHub: ${post.githubUrl}`);
                if (post.tags.length > 0) lines.push(`Tags: ${post.tags.join(', ')}`);
                lines.push(`Published: ${new Date(post.publishedAt).toISOString().slice(0, 10)} · Reading time: ${post.readingTime} min`);
                lines.push('');
            }
        }

        if (commercialPosts.length > 0) {
            lines.push('## Commercial Portfolio');
            lines.push('');
            lines.push('Paid engagements delivered to clients and employers. Code is private; the case studies cover architecture, decisions, and outcomes.');
            lines.push('');
            for (const post of commercialPosts) {
                const postUrl = `${siteUrl}/portfolio/${post.slug}`;
                lines.push(`### [${post.title}](${postUrl})`);
                if (post.subtitle) lines.push(`*${post.subtitle}*`);
                lines.push('');
                lines.push(post.excerpt);
                lines.push('');
                if (post.clientName) lines.push(`Client: ${post.clientName}`);
                if (post.role) lines.push(`Role: ${post.role}`);
                if (post.engagementPeriod) lines.push(`Period: ${post.engagementPeriod}`);
                if (post.tags.length > 0) lines.push(`Tags: ${post.tags.join(', ')}`);
                lines.push(`Published: ${new Date(post.publishedAt).toISOString().slice(0, 10)} · Reading time: ${post.readingTime} min`);
                lines.push('');
            }
        }
    } catch (err) {
        console.error('[llms.txt] Could not fetch posts:', err);
    }

    // Contact
    lines.push('## Contact');
    lines.push('');
    lines.push(`- Website: ${siteUrl}`);
    lines.push(`- Contact form: ${siteUrl}/contact`);
    for (const item of contact.items) {
        lines.push(`- ${item.text}`);
    }
    lines.push('');

    // Skills
    lines.push('## Skills');
    lines.push('');
    for (const group of skills) {
        const skillNames = group.skills.map(s => s.name).join(', ');
        lines.push(`- **${group.name}**: ${skillNames}`);
    }
    lines.push('');

    // Technologies by category
    lines.push('## Technologies');
    lines.push('');
    const categories = new Map<string, string[]>();
    for (const tech of FavoriteTechItems) {
        const cat = tech.category;
        if (!categories.has(cat)) categories.set(cat, []);
        categories.get(cat)!.push(tech.title);
    }
    for (const [cat, techs] of categories) {
        lines.push(`- **${cat}**: ${techs.join(', ')}`);
    }
    lines.push('');

    // Career
    lines.push('## Career');
    lines.push('');
    for (const job of experience) {
        lines.push(`### ${job.title}, ${job.location} (${job.date})`);
        lines.push('');
    }

    // Education
    lines.push('## Education');
    lines.push('');
    for (const edu of education) {
        lines.push(`- **${edu.title}**, ${edu.location} (${edu.date})`);
    }
    lines.push('');

    // Open Source (hardcoded legacy list, kept alongside the new Portfolio Posts)
    lines.push('## Open Source Projects');
    lines.push('');
    for (const project of portfolioItems) {
        lines.push(`- **${project.title}**: ${project.description}`);
    }
    lines.push('');

    // About items
    lines.push('## Personal');
    lines.push('');
    for (const item of aboutData.aboutItems) {
        if (item.text) {
            lines.push(`- ${item.label}: ${item.text}`);
        }
    }
    lines.push('');

    // This website as a template
    lines.push('## Build Your Own Resume Website');
    lines.push('');
    lines.push('This website is open source and available as a template. Built with Next.js 16, React 19, TypeScript, Tailwind CSS 4, and MongoDB for the blog. Features include server-side rendering, dynamic PDF resume generation, GitHub stats integration, reCAPTCHA contact form, AI-optimized SEO, and a MongoDB-backed portfolio blog.');
    lines.push('');
    lines.push('Fork it on GitHub: https://github.com/georgekhananaev/resume-website');

    return lines.join('\n');
}

export async function GET() {
    const content = await buildContent();
    return new Response(content, {
        headers: {
            'Content-Type': 'text/plain; charset=utf-8',
            'Cache-Control': 'public, max-age=3600, s-maxage=3600',
        },
    });
}
