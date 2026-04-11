import rehypeAutolinkHeadings from 'rehype-autolink-headings';
import rehypeExternalLinks from 'rehype-external-links';
import rehypePrism from 'rehype-prism-plus';
import rehypeSanitize, {defaultSchema, type Options as SanitizeOptions} from 'rehype-sanitize';
import rehypeSlug from 'rehype-slug';
import rehypeStringify from 'rehype-stringify';
import remarkGfm from 'remark-gfm';
import remarkParse from 'remark-parse';
import remarkRehype from 'remark-rehype';
import {unified} from 'unified';
import {visit} from 'unist-util-visit';

export interface TocEntry {
    id: string;
    text: string;
    depth: number;
}

/**
 * Schema that extends rehype-sanitize's default to allow:
 *   - className on <pre>, <code>, <span>, <div> (so Prism syntax highlighting survives)
 *   - id on headings (so rehype-slug anchors survive)
 *   - rel + target on <a> (so rehype-external-links' noopener/noreferrer/_blank survive)
 *   - ariaHidden / tabIndex / className on <a>
 */
const highlightFriendlySchema: SanitizeOptions = {
    ...defaultSchema,
    attributes: {
        ...defaultSchema.attributes,
        code: [...(defaultSchema.attributes?.code || []), ['className']],
        pre: [...(defaultSchema.attributes?.pre || []), ['className']],
        span: [...(defaultSchema.attributes?.span || []), ['className']],
        div: [...(defaultSchema.attributes?.div || []), ['className']],
        h1: [...(defaultSchema.attributes?.h1 || []), 'id'],
        h2: [...(defaultSchema.attributes?.h2 || []), 'id'],
        h3: [...(defaultSchema.attributes?.h3 || []), 'id'],
        h4: [...(defaultSchema.attributes?.h4 || []), 'id'],
        h5: [...(defaultSchema.attributes?.h5 || []), 'id'],
        h6: [...(defaultSchema.attributes?.h6 || []), 'id'],
        a: [
            ...(defaultSchema.attributes?.a || []),
            ['ariaHidden'],
            ['tabIndex'],
            ['className'],
            ['rel'],
            ['target'],
        ],
    },
};

/**
 * Process raw markdown into sanitized HTML with:
 * - GitHub Flavored Markdown (tables, strikethrough, task lists, autolinks)
 * - Slugged heading IDs
 * - Autolinked anchors on headings
 * - Prism syntax highlighting (server-side)
 * - rehype-sanitize to strip anything dangerous
 */
export async function markdownToHtml(markdown: string): Promise<string> {
    const file = await unified()
        .use(remarkParse)
        .use(remarkGfm)
        .use(remarkRehype, {allowDangerousHtml: false})
        .use(rehypeSlug)
        .use(rehypeAutolinkHeadings, {
            behavior: 'wrap',
            properties: {className: 'heading-anchor', ariaHidden: 'false'},
        })
        .use(rehypeExternalLinks, {
            // Any link whose href has a protocol (http://, https://, mailto:)
            // is treated as external. Relative links like /portfolio/slug are
            // left alone so they don't pick up target="_blank" or noopener.
            target: '_blank',
            rel: ['nofollow', 'noopener', 'noreferrer'],
            protocols: ['http', 'https', 'mailto'],
        })
        .use(rehypePrism, {ignoreMissing: true})
        .use(rehypeSanitize, highlightFriendlySchema)
        .use(rehypeStringify)
        .process(markdown);

    return String(file);
}

/**
 * Extract a table-of-contents outline from markdown (h2–h3 only).
 * Runs a separate parse pass: cheap and avoids polluting the render pipeline.
 */
export function extractToc(markdown: string): TocEntry[] {
    const entries: TocEntry[] = [];
    const tree = unified().use(remarkParse).parse(markdown);

    visit(tree, 'heading', node => {
        if (node.depth < 2 || node.depth > 3) return;
        const text = node.children
            .map(c => ('value' in c && typeof c.value === 'string' ? c.value : ''))
            .join('')
            .trim();
        if (!text) return;
        const id = slugify(text);
        entries.push({id, text, depth: node.depth});
    });

    return entries;
}

/**
 * Minimal slugifier matching rehype-slug's behavior (github-slugger).
 * Keeps the output consistent between the ToC we build manually and the
 * heading IDs applied by rehype-slug.
 */
function slugify(text: string): string {
    return text
        .toLowerCase()
        .trim()
        .replace(/[^\w\s-]/g, '')
        .replace(/[\s_]+/g, '-')
        .replace(/^-+|-+$/g, '');
}
