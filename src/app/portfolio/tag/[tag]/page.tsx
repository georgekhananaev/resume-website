import type {Metadata} from 'next';
import {notFound} from 'next/navigation';

import PageBreadcrumbs from '../../../../components/Layout/PageBreadcrumbs';
import PageHero from '../../../../components/Layout/PageHero';
import PostRow from '../../../../components/Portfolio/PostRow';
import TagCloud from '../../../../components/Portfolio/TagCloud';
import Footer from '../../../../components/Sections/Footer';
import Header from '../../../../components/Sections/Header';
import {enrichWithStars} from '../../../../lib/post-stars';
import {getAllTags, getPostsByTag} from '../../../../lib/posts';

export const revalidate = 3600;

const siteUrl = (process.env.SITE_URL || 'https://george.khananaev.com').replace(/\/$/, '');

interface PageProps {
    params: Promise<{tag: string}>;
}

export async function generateStaticParams() {
    const tags = await getAllTags();
    return tags.map(tag => ({tag}));
}

export async function generateMetadata({params}: PageProps): Promise<Metadata> {
    const {tag} = await params;
    const url = `${siteUrl}/portfolio/tag/${tag}`;
    const title = `Posts tagged #${tag} | George Khananaev`;
    const description = `Case studies, technical deep-dives, and open-source projects by George Khananaev tagged with ${tag}.`;

    return {
        title,
        description,
        alternates: {canonical: url},
        openGraph: {
            type: 'website',
            title,
            description,
            url,
            siteName: 'George Khananaev',
            images: [{
                url: '/og-image.png',
                width: 1200,
                height: 630,
                alt: `Posts tagged #${tag} — George Khananaev`,
                type: 'image/png',
            }],
        },
        twitter: {
            card: 'summary_large_image',
            title,
            description,
            images: ['/og-image.png'],
        },
    };
}

export default async function TagPage({params}: PageProps) {
    const {tag} = await params;
    const [rawPosts, allTags] = await Promise.all([getPostsByTag(tag), getAllTags()]);

    if (rawPosts.length === 0 && !allTags.includes(tag)) {
        notFound();
    }

    const posts = await enrichWithStars(rawPosts);

    const url = `${siteUrl}/portfolio/tag/${tag}`;

    const jsonLd = {
        '@context': 'https://schema.org',
        '@graph': [
            {
                '@type': 'CollectionPage',
                '@id': `${url}#collection`,
                url,
                name: `Posts tagged #${tag}`,
                isPartOf: {'@id': `${siteUrl}/#website`},
                about: {'@id': `${siteUrl}/#person`},
                mainEntity: {
                    '@type': 'ItemList',
                    numberOfItems: posts.length,
                    itemListElement: posts.slice(0, 20).map((post, idx) => ({
                        '@type': 'ListItem',
                        position: idx + 1,
                        url: `${siteUrl}/portfolio/${post.slug}`,
                        name: post.title,
                    })),
                },
            },
            {
                '@type': 'BreadcrumbList',
                itemListElement: [
                    {'@type': 'ListItem', position: 1, name: 'Home', item: siteUrl},
                    {'@type': 'ListItem', position: 2, name: 'Portfolio', item: `${siteUrl}/portfolio`},
                    {'@type': 'ListItem', position: 3, name: `#${tag}`, item: url},
                ],
            },
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
                        {label: `#${tag}`},
                    ]}
                />
                <PageHero
                    description={`${posts.length} ${posts.length === 1 ? 'post' : 'posts'}`}
                    eyebrow="Tag archive"
                    title={`#${tag}`}
                />

                <section className="mx-auto max-w-screen-xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
                    {posts.length === 0 ? (
                        <p className="text-center text-neutral-400">No posts in this tag yet.</p>
                    ) : (
                        <div className="flex flex-col gap-4">
                            {posts.map(post => (
                                <PostRow key={post.slug} post={post} />
                            ))}
                        </div>
                    )}
                </section>

                <section className="relative overflow-hidden border-t border-white/5 bg-neutral-950 px-4 py-20 sm:px-6 sm:py-24 lg:px-8 lg:py-28">
                    <div
                        aria-hidden="true"
                        className="pointer-events-none absolute inset-0 opacity-[0.035]"
                        style={{
                            backgroundImage:
                                'linear-gradient(to right, #fff 1px, transparent 1px), linear-gradient(to bottom, #fff 1px, transparent 1px)',
                            backgroundSize: '80px 80px',
                        }}
                    />
                    <div className="relative mx-auto max-w-screen-md">
                        <div className="mb-8">
                            <p className="text-sm font-semibold uppercase tracking-widest text-indigo-400">Browse by topic</p>
                            <h2 className="mt-2 text-3xl font-bold leading-tight text-white sm:text-4xl">All tags</h2>
                        </div>
                        <TagCloud tags={allTags} />
                    </div>
                </section>
            </main>
            <Footer />
        </>
    );
}
