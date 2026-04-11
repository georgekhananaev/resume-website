import Link from 'next/link';

import Footer from '../../../components/Sections/Footer';
import Header from '../../../components/Sections/Header';

export default function PostNotFound() {
    return (
        <>
            <Header />
            <main className="flex min-h-screen flex-col items-center justify-center bg-neutral-950 px-6 text-center">
                <p className="text-sm font-semibold uppercase tracking-widest text-indigo-400">Error 404</p>
                <h1 className="mt-3 text-5xl font-bold text-white sm:text-6xl">Post not found</h1>
                <p className="mt-4 max-w-md text-base text-neutral-300">
                    The post you&apos;re looking for doesn&apos;t exist or has been unpublished.
                </p>
                <Link
                    className="mt-8 inline-block rounded-full bg-indigo-500 px-8 py-3 text-sm font-semibold text-white transition-colors hover:bg-indigo-400"
                    href="/portfolio">
                    Back to portfolio
                </Link>
            </main>
            <Footer />
        </>
    );
}
