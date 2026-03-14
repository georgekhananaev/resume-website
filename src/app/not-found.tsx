import type {Metadata} from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
    title: 'Page not found | George Khananaev',
    description: 'The page you requested could not be found.',
    robots: {
        index: false,
        follow: false,
    },
};

export default function NotFound() {
    return (
        <main className="flex min-h-screen flex-col items-center justify-center bg-neutral-900 px-6 text-center">
            <p className="text-sm font-semibold uppercase tracking-widest text-orange-500">Error 404</p>
            <h1 className="mt-3 text-7xl font-bold text-white sm:text-8xl">Page not found</h1>
            <p className="mt-4 max-w-md text-base text-neutral-300">
                The page you&apos;re looking for doesn&apos;t exist or has been moved.
            </p>
            <Link
                className="mt-8 inline-block rounded-full bg-orange-500 px-8 py-3 text-sm font-semibold text-white transition-colors hover:bg-orange-600"
                href="/">
                Back to homepage
            </Link>
        </main>
    );
}
