import Link from 'next/link';

export default function TagCloud({tags}: {tags: string[]}) {
    if (tags.length === 0) return null;

    return (
        <div className="flex flex-wrap gap-2">
            {tags.map(tag => (
                <Link
                    className="rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-sm text-neutral-300 transition-colors hover:border-indigo-400/50 hover:text-indigo-300"
                    href={`/portfolio/tag/${tag}`}
                    key={tag}>
                    #{tag}
                </Link>
            ))}
        </div>
    );
}
