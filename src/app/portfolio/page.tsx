import type {Metadata} from 'next';

import PageBreadcrumbs from '../../components/Layout/PageBreadcrumbs';
import PageHero from '../../components/Layout/PageHero';
import PortfolioToggleSection from '../../components/Portfolio/PortfolioToggleSection';
import TagCloud from '../../components/Portfolio/TagCloud';
import Footer from '../../components/Sections/Footer';
import Header from '../../components/Sections/Header';
import {buildBreadcrumbList} from '../../lib/breadcrumb';
import {enrichWithStars} from '../../lib/post-stars';
import {
    getAllTags,
    getCommercialPortfolioPosts,
    getFeaturedPosts,
    getPublicPortfolioPosts,
} from '../../lib/posts';


export const revalidate = 3600;

const siteUrl = (process.env.SITE_URL || 'https://george.khananaev.com').replace(/\/$/, '');
const pageUrl = `${siteUrl}/portfolio`;
const portfolioImage = '/webp/george_khananaev_ws.webp';
const portfolioImageWidth = 1129;
const portfolioImageHeight = 1280;
const title = 'Portfolio | George Khananaev';
const description =
    'Public portfolio of projects, case studies, and open source by George Khananaev: multi-tenant platforms, AI integration, workflow automation, and senior full-stack engineering.';

export const metadata: Metadata = {
    title,
    description,
    alternates: {canonical: pageUrl},
    openGraph: {
        type: 'website',
        siteName: 'George Khananaev',
        title,
        description,
        url: pageUrl,
        images: [
            {
                url: portfolioImage,
                width: portfolioImageWidth,
                height: portfolioImageHeight,
                alt: 'George Khananaev portfolio',
                type: 'image/webp',
            },
        ],
        locale: 'en_US',
    },
    twitter: {
        card: 'summary',
        title,
        description,
        images: [portfolioImage],
    },
};

export default async function PortfolioPage() {
    const [rawFeaturedPosts, rawCommercialPosts, rawPublicPosts, tags] = await Promise.all([
        getFeaturedPosts(20),
        getCommercialPortfolioPosts(100),
        getPublicPortfolioPosts(100),
        getAllTags(),
    ]);

    const featuredPosts = await enrichWithStars(rawFeaturedPosts);
    const publicPosts = await enrichWithStars(rawPublicPosts);
    const allCommercialPosts = await enrichWithStars(rawCommercialPosts);

    // Split featured posts into the two toggle tabs.
    const featuredCommercial = featuredPosts.filter(p => p.portfolioType === 'commercial');
    const featuredPublic = featuredPosts.filter(p => p.portfolioType !== 'commercial');

    // Exclude featured posts from the Other Portfolio section so they are
    // not rendered twice on the page. The Featured section at the top already
    // shows them.
    const featuredSlugs = new Set(featuredPosts.map(p => p.slug));
    const otherCommercial = allCommercialPosts.filter(p => !featuredSlugs.has(p.slug));
    const otherPublic = publicPosts.filter(p => !featuredSlugs.has(p.slug));

    // For JSON-LD, keep the canonical order: Featured → Other Commercial → Other Public.
    const allForSchema = [...featuredPosts, ...otherCommercial, ...otherPublic];

    const jsonLd = {
        '@context': 'https://schema.org',
        '@graph': [
            {
                '@type': 'CollectionPage',
                '@id': `${pageUrl}/#collection`,
                url: pageUrl,
                name: title,
                description,
                image: {
                    '@type': 'ImageObject',
                    url: `${siteUrl}${portfolioImage}`,
                    width: portfolioImageWidth,
                    height: portfolioImageHeight,
                },
                isPartOf: {'@id': `${siteUrl}/#website`},
                about: {'@id': `${siteUrl}/#person`},
                mainEntity: {
                    '@type': 'ItemList',
                    numberOfItems: allForSchema.length,
                    itemListElement: allForSchema.slice(0, 20).map((post, idx) => ({
                        '@type': 'ListItem',
                        position: idx + 1,
                        url: `${siteUrl}/portfolio/${post.slug}`,
                        name: post.title,
                    })),
                },
            },
            buildBreadcrumbList([
                {name: 'Home', url: siteUrl},
                {name: 'Portfolio', url: pageUrl},
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
                        {label: 'Portfolio'},
                    ]}
                />
                <PageHero
                    description="Commercial systems running in production and open-source projects on GitHub."
                    eyebrow="Portfolio"
                    subtitle="Production platforms and open source"
                    title="Work"
                />

                <PortfolioToggleSection
                    commercial={featuredCommercial}
                    defaultTab="commercial"
                    eyebrow="Selected work"
                    publicPosts={featuredPublic}
                    subtitle="The projects I'm proudest of across commercial engagements and open source. Start here."
                    title="Featured"
                />

                <PortfolioToggleSection
                    bordered
                    commercial={otherCommercial}
                    defaultTab="commercial"
                    eyebrow="Archive"
                    publicPosts={otherPublic}
                    showRssLink
                    subtitle="The rest of the catalog, case studies, side projects, and experiments."
                    title="More work"
                />

                {featuredPosts.length === 0 && otherCommercial.length === 0 && otherPublic.length === 0 && (
                    <section className="mx-auto max-w-screen-lg px-4 py-24 text-center sm:px-6 lg:px-8">
                        <p className="text-lg text-neutral-400">No posts yet.</p>
                    </section>
                )}

                {tags.length > 0 && (
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
                            <TagCloud tags={tags} />
                        </div>
                    </section>
                )}
            </main>
            <Footer />
        </>
    );
}
