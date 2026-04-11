'use client';

export default function GlobalError({reset}: {error: Error & {digest?: string}; reset: () => void}) {
    return (
        <html data-scroll-behavior="smooth" lang="en">
            <body className="bg-neutral-900">
                <main className="flex min-h-screen flex-col items-center justify-center px-6 text-center">
                    <p className="text-sm font-semibold uppercase tracking-widest text-indigo-500">Error 500</p>
                    <h1 className="mt-3 text-7xl font-bold text-white sm:text-8xl">Something went wrong</h1>
                    <p className="mt-4 max-w-md text-base text-neutral-300">
                        An unexpected error occurred. Please try again.
                    </p>
                    <button
                        className="mt-8 inline-block cursor-pointer rounded-full bg-indigo-500 px-8 py-3 text-sm font-semibold text-white transition-colors hover:bg-indigo-600"
                        onClick={reset}
                        type="button">
                        Try again
                    </button>
                </main>
            </body>
        </html>
    );
}
