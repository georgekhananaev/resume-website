import type {PostWithStars} from '../../lib/post-stars';
import PostCard from './PostCard';

export default function RelatedPosts({posts}: {posts: PostWithStars[]}) {
    if (posts.length === 0) return null;

    return (
        <section aria-labelledby="related-posts-heading" className="mx-auto max-w-screen-lg px-4 py-16 sm:px-6 lg:px-8">
            <h2 className="mb-8 text-center text-3xl font-bold text-white sm:text-4xl" id="related-posts-heading">
                Related posts
            </h2>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                {posts.map(post => (
                    <PostCard key={post.slug} post={post} />
                ))}
            </div>
        </section>
    );
}
