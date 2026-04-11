import type {ObjectId} from 'mongodb';

export type PostStatus = 'draft' | 'published' | 'archived';
export type PostCategory = 'Case Study' | 'Technical Deep-Dive' | 'Open Source' | 'Opinion';
export type ContentType = 'markdown' | 'html';
export type ArticleType = 'BlogPosting' | 'TechArticle' | 'Review' | 'HowTo';
export type PortfolioType = 'public' | 'commercial';

export interface PostImage {
    url: string;
    alt: string;
    width: number;
    height: number;
    caption?: string;
}

export interface PostSeo {
    metaTitle?: string;
    metaDescription?: string;
    keywords?: string[];
    canonicalUrl?: string;
    ogImage?: string;
    ogType?: 'article' | 'blog_post';
    noindex?: boolean;
    nofollow?: boolean;
}

export interface PostAuthor {
    name: string;
    url: string;
    avatar?: string;
}

export interface PostInternalLink {
    label: string;
    href: string;
}

export interface PostJsonLdHints {
    type?: ArticleType;
    about?: string[];
    mentions?: string[];
}

/**
 * Full post document as stored in MongoDB.
 * `_id` is added by MongoDB on insert.
 */
export interface Post {
    _id?: ObjectId | string;
    slug: string;
    title: string;
    subtitle?: string;
    excerpt: string;
    content: string;
    contentType?: ContentType;

    seo: PostSeo;

    thumbnail: PostImage;
    coverImage?: PostImage;

    tags: string[];
    category?: PostCategory;
    series?: string;

    /**
     * public = open-source project with GitHub link.
     * commercial = paid client/employer work, usually no public code.
     * Default: 'public'.
     */
    portfolioType?: PortfolioType;

    /** Commercial-only fields — all optional, never required for public posts. */
    clientName?: string;
    clientUrl?: string;
    engagementPeriod?: string;
    role?: string;
    deliverables?: string[];
    isConfidential?: boolean;

    author: PostAuthor;

    publishedAt: Date;
    updatedAt: Date;
    createdAt: Date;

    readingTime: number;
    wordCount: number;

    status: PostStatus;
    featured: boolean;
    pinned?: boolean;

    relatedPostSlugs?: string[];
    internalLinks?: PostInternalLink[];

    jsonLd?: PostJsonLdHints;

    githubUrl?: string;
    demoUrl?: string;
    npmUrl?: string;

    previousSlugs?: string[];
}

/**
 * The view a listing page receives. A lighter projection of Post
 * that excludes the full content body to keep payloads small.
 */
export type PostSummary = Omit<Post, 'content'> & {content?: never};

/**
 * Defaults applied when a partial post document is inserted.
 */
export const defaultAuthor: PostAuthor = {
    name: 'George Khananaev',
    url: 'https://george.khananaev.com',
};

/**
 * Minimum content length enforced by the seed + admin layer.
 * Thin posts hurt the whole domain.
 */
export const MIN_CONTENT_WORDS = 250;
