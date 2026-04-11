import {ImageResponse} from 'next/og';

import {getPostBySlug} from '../../../lib/posts';

/**
 * Per-post Open Graph image, 1200×630. Rendered at edge time using Next.js's
 * ImageResponse API. One unique social-share preview per post without any
 * manual design work.
 */

export const runtime = 'nodejs';
export const size = {width: 1200, height: 630};
export const contentType = 'image/png';

export const alt = 'George Khananaev portfolio post';

interface Props {
    params: Promise<{slug: string}>;
}

export default async function Image({params}: Props) {
    const {slug} = await params;
    const post = await getPostBySlug(slug);

    if (!post) {
        return new ImageResponse(
            (
                <div
                    style={{
                        width: '100%',
                        height: '100%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        backgroundColor: '#0a0a0a',
                        color: '#ffffff',
                        fontSize: 48,
                    }}>
                    George Khananaev
                </div>
            ),
            size,
        );
    }

    return new ImageResponse(
        (
            <div
                style={{
                    width: '100%',
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    padding: '72px 80px',
                    backgroundColor: '#0a0a0a',
                    backgroundImage:
                        'radial-gradient(circle at 80% 20%, rgba(99, 102, 241, 0.25), transparent 55%), radial-gradient(circle at 20% 80%, rgba(99, 102, 241, 0.12), transparent 50%)',
                    color: '#ffffff',
                    fontFamily: 'system-ui, -apple-system, sans-serif',
                }}>
                <div style={{display: 'flex', alignItems: 'center', gap: 16}}>
                    <div
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            padding: '8px 20px',
                            borderRadius: 999,
                            border: '1px solid rgba(129, 140, 248, 0.5)',
                            backgroundColor: 'rgba(129, 140, 248, 0.1)',
                            color: '#a5b4fc',
                            fontSize: 18,
                            fontWeight: 600,
                            textTransform: 'uppercase',
                            letterSpacing: 2,
                        }}>
                        {post.category ?? 'Portfolio'}
                    </div>
                </div>

                <div style={{display: 'flex', flexDirection: 'column', gap: 18}}>
                    <div
                        style={{
                            fontSize: post.title.length > 50 ? 56 : 72,
                            fontWeight: 800,
                            lineHeight: 1.05,
                            letterSpacing: -1,
                            color: '#ffffff',
                        }}>
                        {post.title}
                    </div>
                    {post.subtitle && (
                        <div
                            style={{
                                fontSize: 28,
                                fontWeight: 500,
                                color: '#818cf8',
                                lineHeight: 1.3,
                                maxWidth: 900,
                            }}>
                            {post.subtitle}
                        </div>
                    )}
                </div>

                <div style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between'}}>
                    <div style={{display: 'flex', alignItems: 'center', gap: 16}}>
                        <div
                            style={{
                                width: 56,
                                height: 56,
                                borderRadius: 999,
                                backgroundColor: '#818cf8',
                                color: '#0a0a0a',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontSize: 28,
                                fontWeight: 700,
                            }}>
                            GK
                        </div>
                        <div style={{display: 'flex', flexDirection: 'column', gap: 2}}>
                            <div style={{fontSize: 22, fontWeight: 700, color: '#ffffff'}}>George Khananaev</div>
                            <div style={{fontSize: 18, color: '#a3a3a3'}}>george.khananaev.com</div>
                        </div>
                    </div>
                    <div style={{display: 'flex', alignItems: 'center', gap: 10}}>
                        {post.tags.slice(0, 3).map(tag => (
                            <div
                                key={tag}
                                style={{
                                    display: 'flex',
                                    padding: '6px 16px',
                                    borderRadius: 999,
                                    border: '1px solid rgba(255, 255, 255, 0.15)',
                                    backgroundColor: 'rgba(255, 255, 255, 0.05)',
                                    color: '#d4d4d4',
                                    fontSize: 16,
                                    fontWeight: 500,
                                }}>
                                {`#${tag}`}
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        ),
        size,
    );
}
