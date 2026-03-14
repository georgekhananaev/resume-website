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
        <main className="mx-auto flex min-h-screen max-w-screen-md flex-col items-center justify-center px-6 text-center">
            <h1 className="text-6xl font-bold text-white">404</h1>
            <p className="mt-4 text-lg text-neutral-400">This page does not exist.</p>
            <Link className="mt-6 rounded-full border-2 border-orange-500 px-6 py-2 text-sm font-medium text-white transition-colors hover:bg-orange-500" href="/">
                Back home
            </Link>
        </main>
    );
}
