import type {TocEntry} from '../../lib/markdown';

export default function TableOfContents({entries}: {entries: TocEntry[]}) {
    if (entries.length < 3) return null;

    return (
        <aside aria-label="Table of contents" className="hidden xl:sticky xl:top-24 xl:block">
            <div className="rounded-2xl border border-white/10 bg-neutral-900/40 p-5 backdrop-blur">
                <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-indigo-400">On this page</p>
                <nav>
                    <ul className="space-y-2 text-sm">
                        {entries.map(entry => (
                            <li className={entry.depth === 3 ? 'pl-4' : ''} key={entry.id}>
                                <a
                                    className="block text-neutral-400 transition-colors hover:text-indigo-300"
                                    href={`#${entry.id}`}>
                                    {entry.text}
                                </a>
                            </li>
                        ))}
                    </ul>
                </nav>
            </div>
        </aside>
    );
}
