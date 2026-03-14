import {aboutData, contact, education, experience, FavoriteTechItems, portfolioItems, skills} from '../../data/data';

const siteUrl = (process.env.SITE_URL || 'https://george.khananaev.com').replace(/\/$/, '');

function buildContent(): string {
    const lines: string[] = [];

    // Header
    lines.push('# George Khananaev');
    lines.push('');
    lines.push('> Full Stack Developer & Head of Development based in Bangkok, Thailand');
    lines.push('');

    // Summary from about data
    lines.push('## Summary');
    lines.push('');
    lines.push(aboutData.description);
    lines.push('');

    // Contact
    lines.push('## Contact');
    lines.push('');
    lines.push(`- Website: ${siteUrl}`);
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
        lines.push(`### ${job.title} — ${job.location} (${job.date})`);
        lines.push('');
    }

    // Education
    lines.push('## Education');
    lines.push('');
    for (const edu of education) {
        lines.push(`- **${edu.title}** — ${edu.location} (${edu.date})`);
    }
    lines.push('');

    // Open Source
    lines.push('## Open Source Projects');
    lines.push('');
    for (const project of portfolioItems) {
        lines.push(`- **${project.title}** — ${project.description}`);
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

    return lines.join('\n');
}

export async function GET() {
    return new Response(buildContent(), {
        headers: {
            'Content-Type': 'text/plain; charset=utf-8',
            'Cache-Control': 'public, max-age=86400, s-maxage=86400',
        },
    });
}
