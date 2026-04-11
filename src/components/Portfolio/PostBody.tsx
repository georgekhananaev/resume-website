export default function PostBody({html}: {html: string}) {
    return (
        <div
            className="prose prose-invert prose-lg mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-0 prose-headings:scroll-mt-24 prose-headings:font-bold prose-h2:text-3xl prose-h2:text-white prose-h3:text-2xl prose-h3:text-white prose-p:text-neutral-300 prose-a:text-indigo-400 prose-a:no-underline hover:prose-a:underline prose-strong:text-white prose-code:rounded prose-code:bg-neutral-800 prose-code:px-1.5 prose-code:py-0.5 prose-code:text-sm prose-code:font-normal prose-code:text-indigo-300 prose-code:before:content-none prose-code:after:content-none prose-pre:rounded-xl prose-pre:bg-neutral-900 prose-pre:ring-1 prose-pre:ring-white/10 prose-img:rounded-xl prose-img:ring-1 prose-img:ring-white/10 prose-hr:border-neutral-800 prose-li:text-neutral-300 prose-blockquote:border-l-indigo-400 prose-blockquote:text-neutral-300"
            dangerouslySetInnerHTML={{__html: html}}
        />
    );
}
