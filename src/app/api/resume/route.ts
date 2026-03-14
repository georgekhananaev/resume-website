import {jsPDF} from 'jspdf';
import {NextResponse} from 'next/server';

import {aboutData, education, experience, skills, socialLinks} from '../../../data/data';

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

function stripJsx(node: React.ReactNode): string[] {
    if (typeof node === 'string') return [node.trim()];
    if (typeof node === 'number') return [String(node)];
    if (!node) return [];
    if (Array.isArray(node)) return node.flatMap(stripJsx);
    if (typeof node === 'object' && 'props' in node) {
        const el = node as React.ReactElement<{children?: React.ReactNode}>;
        const tag = typeof el.type === 'string' ? el.type : '';
        const children = stripJsx(el.props.children);
        if (tag === 'li') return [children.join(' ').trim()];
        if (tag === 'br') return ['\n'];
        return children;
    }
    return [];
}

// Brand colors
const ORANGE = [249, 115, 22] as const;
const DARK = [17, 17, 17] as const;
const GRAY = [100, 100, 100] as const;
const LIGHT_GRAY = [160, 160, 160] as const;
const SIDEBAR_BG = [20, 20, 30] as const;
const WHITE = [255, 255, 255] as const;

export async function GET() {
    const name = 'George Khananaev';
    const age = calcAge();
    const location = aboutData.aboutItems.find(i => i.label === 'Location')?.text || '';
    const nationality = aboutData.aboutItems.find(i => i.label === 'Nationality')?.text || '';
    const website = process.env.SITE_URL || 'https://george.khananaev.com';

    const doc = new jsPDF({orientation: 'portrait', unit: 'mm', format: 'a4'});
    const pageW = doc.internal.pageSize.getWidth(); // 210
    const pageH = doc.internal.pageSize.getHeight(); // 297
    const sidebarW = 62;
    const mainX = sidebarW + 10;
    const mainW = pageW - mainX - 12;
    let mainY = 20;
    let sideY = 20;

    const checkPage = (needed: number) => {
        if (mainY + needed > pageH - 15) {
            doc.addPage();
            // Draw sidebar on new page
            doc.setFillColor(...SIDEBAR_BG);
            doc.rect(0, 0, sidebarW, pageH, 'F');
            mainY = 20;
            sideY = 20;
        }
    };

    // ====== PAGE 1 ======

    // --- Sidebar background ---
    doc.setFillColor(...SIDEBAR_BG);
    doc.rect(0, 0, sidebarW, pageH, 'F');

    // --- Orange accent bar at top ---
    doc.setFillColor(...ORANGE);
    doc.rect(0, 0, sidebarW, 3, 'F');

    // --- Sidebar: Name ---
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(14);
    doc.setTextColor(...WHITE);
    doc.text(name.split(' ')[0], 10, sideY + 6);
    sideY += 10;
    doc.text(name.split(' ')[1] || '', 10, sideY + 2);
    sideY += 10;

    // --- Sidebar: Title ---
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7);
    doc.setTextColor(...ORANGE);
    doc.text('HEAD OF DEVELOPMENT', 10, sideY);
    sideY += 8;

    // --- Sidebar: Details ---
    const sidebarLabel = (label: string, value: string) => {
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(6.5);
        doc.setTextColor(...ORANGE);
        doc.text(label.toUpperCase(), 10, sideY);
        sideY += 3.5;
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(7.5);
        doc.setTextColor(200, 200, 200);
        const lines = doc.splitTextToSize(value, sidebarW - 20);
        doc.text(lines, 10, sideY);
        sideY += lines.length * 3.5 + 3;
    };

    sidebarLabel('Location', location);
    if (age) sidebarLabel('Age', age);
    sidebarLabel('Nationality', nationality);

    // --- Sidebar: Links ---
    sideY += 2;
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(6.5);
    doc.setTextColor(...ORANGE);
    doc.text('LINKS', 10, sideY);
    sideY += 4;

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7);
    doc.setTextColor(200, 200, 200);
    doc.text(website.replace('https://', ''), 10, sideY);
    sideY += 4;
    for (const link of socialLinks) {
        doc.text(link.href.replace('https://www.', '').replace('https://', ''), 10, sideY);
        sideY += 4;
    }

    // --- Sidebar: Skills ---
    sideY += 4;
    for (const group of skills) {
        if (sideY > pageH - 30) break; // Don't overflow sidebar
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(6.5);
        doc.setTextColor(...ORANGE);
        doc.text(group.name.toUpperCase(), 10, sideY);
        sideY += 4;

        for (const skill of group.skills) {
            if (sideY > pageH - 15) break;
            doc.setFont('helvetica', 'normal');
            doc.setFontSize(7);
            doc.setTextColor(200, 200, 200);
            doc.text(skill.name, 10, sideY);

            // Skill bar
            const barX = 10;
            const barW = sidebarW - 20;
            const barH = 1.5;
            sideY += 2;
            doc.setFillColor(50, 50, 60);
            doc.rect(barX, sideY, barW, barH, 'F');
            doc.setFillColor(...ORANGE);
            doc.rect(barX, sideY, barW * (skill.level / 10), barH, 'F');
            sideY += 4;
        }
        sideY += 2;
    }

    // ====== MAIN CONTENT ======

    // --- About ---
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8.5);
    doc.setTextColor(...GRAY);
    const aboutLines = doc.splitTextToSize(aboutData.description, mainW);
    doc.text(aboutLines, mainX, mainY);
    mainY += aboutLines.length * 3.5 + 6;

    // --- Section header helper ---
    const sectionHeader = (title: string) => {
        checkPage(14);
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(10);
        doc.setTextColor(...DARK);
        doc.text(title.toUpperCase(), mainX, mainY);
        mainY += 1.5;
        doc.setDrawColor(...ORANGE);
        doc.setLineWidth(0.6);
        doc.line(mainX, mainY, mainX + 30, mainY);
        mainY += 5;
    };

    // --- Experience ---
    sectionHeader('Experience');

    for (const job of experience) {
        checkPage(18);

        // Orange dot
        doc.setFillColor(...ORANGE);
        doc.circle(mainX + 1.5, mainY - 0.5, 1, 'F');

        doc.setFont('helvetica', 'bold');
        doc.setFontSize(9.5);
        doc.setTextColor(...DARK);
        doc.text(job.title, mainX + 5, mainY);

        doc.setFont('helvetica', 'normal');
        doc.setFontSize(7);
        doc.setTextColor(...LIGHT_GRAY);
        const dateW = doc.getTextWidth(job.date);
        doc.text(job.date, pageW - 12 - dateW, mainY);
        mainY += 4;

        doc.setFontSize(7.5);
        doc.setTextColor(...GRAY);
        doc.text(job.location, mainX + 5, mainY);
        mainY += 4;

        const items = stripJsx(job.content).filter(l => l.trim() && l !== '\n');
        doc.setFontSize(8);
        doc.setTextColor(60, 60, 60);
        for (const item of items) {
            const lines = doc.splitTextToSize(item, mainW - 10);
            checkPage(lines.length * 3.3 + 1);
            doc.setTextColor(...ORANGE);
            doc.text('›', mainX + 5, mainY);
            doc.setTextColor(60, 60, 60);
            doc.text(lines, mainX + 9, mainY);
            mainY += lines.length * 3.3 + 0.5;
        }
        mainY += 4;
    }

    // --- Education ---
    sectionHeader('Education');

    for (const edu of education) {
        checkPage(14);

        doc.setFillColor(...ORANGE);
        doc.circle(mainX + 1.5, mainY - 0.5, 1, 'F');

        doc.setFont('helvetica', 'bold');
        doc.setFontSize(9.5);
        doc.setTextColor(...DARK);
        doc.text(edu.title, mainX + 5, mainY);

        doc.setFont('helvetica', 'normal');
        doc.setFontSize(7);
        doc.setTextColor(...LIGHT_GRAY);
        const dateW = doc.getTextWidth(edu.date);
        doc.text(edu.date, pageW - 12 - dateW, mainY);
        mainY += 4;

        doc.setFontSize(7.5);
        doc.setTextColor(...GRAY);
        doc.text(edu.location, mainX + 5, mainY);
        mainY += 4;

        const content = stripJsx(edu.content).join(' ').trim();
        if (content) {
            doc.setFontSize(8);
            doc.setTextColor(60, 60, 60);
            const lines = doc.splitTextToSize(content, mainW - 10);
            checkPage(lines.length * 3.3);
            doc.text(lines, mainX + 5, mainY);
            mainY += lines.length * 3.3;
        }
        mainY += 4;
    }

    // --- Footer ---
    doc.setFontSize(6.5);
    doc.setTextColor(...LIGHT_GRAY);
    doc.text(`Contact: LinkedIn, GitHub, or ${website}`, mainX, pageH - 10);

    // Output
    const pdfBuffer = Buffer.from(doc.output('arraybuffer'));

    return new NextResponse(pdfBuffer, {
        headers: {
            'Content-Type': 'application/pdf',
            'Content-Disposition': 'attachment; filename="George_Khananaev_Resume.pdf"',
        },
    });
}
