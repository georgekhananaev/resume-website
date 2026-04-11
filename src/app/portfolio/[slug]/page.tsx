import type {Metadata} from 'next';
import {notFound} from 'next/navigation';

import PageBreadcrumbs from '../../../components/Layout/PageBreadcrumbs';
import PostBody from '../../../components/Portfolio/PostBody';
import PostFooter from '../../../components/Portfolio/PostFooter';
import PostHeader from '../../../components/Portfolio/PostHeader';
import RelatedPosts from '../../../components/Portfolio/RelatedPosts';
import TableOfContents from '../../../components/Portfolio/TableOfContents';
import Footer from '../../../components/Sections/Footer';
import Header from '../../../components/Sections/Header';
import {buildBreadcrumbList} from '../../../lib/breadcrumb';
import {getStarCount} from '../../../lib/github-stars';
import {extractToc, markdownToHtml} from '../../../lib/markdown';
import {enrichWithStars} from '../../../lib/post-stars';
import {getAllSlugsForStaticParams, getPostBySlug, getRelatedPosts} from '../../../lib/posts';

export const revalidate = 3600;
export const dynamicParams = true;

const siteUrl = (process.env.SITE_URL || 'https://george.khananaev.com').replace(/\/$/, '');

interface PageProps {
    params: Promise<{slug: string}>;
}

export async function generateStaticParams() {
    return getAllSlugsForStaticParams();
}

export async function generateMetadata({params}: PageProps): Promise<Metadata> {
    const {slug} = await params;
    const post = await getPostBySlug(slug);
    if (!post) {
        return {title: 'Post not found'};
    }

    // Always suffix with "| George Khananaev" for brand consistency across the
    // whole site, regardless of whether the seeded metaTitle includes it.
    const rawTitle = post.seo.metaTitle ?? post.title;
    const title = rawTitle.endsWith('| George Khananaev')
        ? rawTitle
        : `${rawTitle} | George Khananaev`;
    const description = post.seo.metaDescription ?? post.excerpt;
    const url = `${siteUrl}/portfolio/${post.slug}`;

    // If the post has an explicit ogImage override in its SEO metadata, use it.
    // Otherwise omit `openGraph.images` entirely so Next.js auto-wires the
    // file-based `opengraph-image.tsx` sibling route — that one renders a real
    // 1200×630 PNG per post via `ImageResponse`, which actually previews in
    // WhatsApp / LinkedIn / X / Slack. The old fallback to the static SVG
    // thumbnail silently broke previews on every major social platform.
    const ogImageOverride = post.seo.ogImage
        ? [{url: post.seo.ogImage, width: 1200, height: 630, alt: post.thumbnail.alt}]
        : undefined;

    return {
        title,
        description,
        keywords: post.seo.keywords,
        alternates: {canonical: post.seo.canonicalUrl ?? url},
        robots: post.seo.noindex
            ? {index: false, follow: !post.seo.nofollow}
            : {index: true, follow: true},
        authors: [{name: post.author.name, url: post.author.url}],
        openGraph: {
            type: 'article',
            title,
            description,
            url,
            siteName: 'George Khananaev',
            locale: 'en_US',
            publishedTime: new Date(post.publishedAt).toISOString(),
            modifiedTime: new Date(post.updatedAt).toISOString(),
            authors: [post.author.url],
            section: post.category,
            tags: post.tags,
            ...(ogImageOverride ? {images: ogImageOverride} : {}),
        },
        twitter: {
            card: 'summary_large_image',
            title,
            description,
            ...(ogImageOverride ? {images: [ogImageOverride[0]!.url]} : {}),
        },
    };
}

export default async function PostPage({params}: PageProps) {
    const {slug} = await params;
    const post = await getPostBySlug(slug);

    if (!post) {
        notFound();
    }

    const [html, rawRelated, stars] = await Promise.all([
        markdownToHtml(post.content),
        getRelatedPosts(post.slug, post.tags, 3),
        getStarCount(post.githubUrl),
    ]);

    const related = await enrichWithStars(rawRelated);
    const postWithStars = {...post, stars};

    const toc = extractToc(post.content);
    const url = `${siteUrl}/portfolio/${post.slug}`;
    const ogImage = post.seo.ogImage ?? `${siteUrl}${post.thumbnail.url}`;

    const articleType = post.jsonLd?.type ?? 'TechArticle';

    const jsonLd = {
        '@context': 'https://schema.org',
        '@graph': [
            {
                '@type': articleType,
                '@id': `${url}#article`,
                headline: post.title,
                alternativeHeadline: post.subtitle,
                description: post.excerpt,
                image: {
                    '@type': 'ImageObject',
                    url: ogImage,
                    width: post.thumbnail.width,
                    height: post.thumbnail.height,
                },
                datePublished: new Date(post.publishedAt).toISOString(),
                dateModified: new Date(post.updatedAt).toISOString(),
                author: {'@id': `${siteUrl}/#person`},
                publisher: {'@id': `${siteUrl}/#person`},
                mainEntityOfPage: {'@type': 'WebPage', '@id': url},
                keywords: post.seo.keywords?.join(', ') ?? post.tags.join(', '),
                articleSection: post.category,
                wordCount: post.wordCount,
                inLanguage: 'en-US',
                about: post.jsonLd?.about?.map(name => ({'@type': 'Thing', name})) ?? undefined,
                mentions: post.jsonLd?.mentions?.map(name => ({'@type': 'Thing', name})) ?? undefined,
                isPartOf: {
                    '@type': 'CollectionPage',
                    '@id': `${siteUrl}/portfolio/#collection`,
                    url: `${siteUrl}/portfolio`,
                    name: 'Portfolio',
                },
            },
            buildBreadcrumbList([
                {name: 'Home', url: siteUrl},
                {name: 'Portfolio', url: `${siteUrl}/portfolio`},
                {name: post.title, url},
            ]),
        ],
    };

    return (
        <>
            <script dangerouslySetInnerHTML={{__html: JSON.stringify(jsonLd)}} type="application/ld+json" />
            <Header />
            <main className="relative bg-neutral-950">
                <PageBreadcrumbs
                    items={[
                        {label: 'Home', href: '/'},
                        {label: 'Portfolio', href: '/portfolio'},
                        {label: post.title},
                    ]}
                />

                <article>
                    <PostHeader post={postWithStars} />

                    <div className="mx-auto max-w-screen-xl px-4 sm:px-6 lg:grid lg:grid-cols-[1fr_280px] lg:gap-8 lg:px-8">
                        <PostBody html={html} />
                        <TableOfContents entries={toc} />
                    </div>

                    <PostFooter post={postWithStars} />
                </article>

                <RelatedPosts posts={related} />
            </main>
            <Footer />
        </>
    );
}
