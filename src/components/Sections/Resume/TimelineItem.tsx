import type {TimelineItem} from '../../../data/dataDef';

/**
 * Timeline entry rendered on a dark editorial background. A vertical indigo
 * marker sits in the left gutter (provided by the parent `<ol>` border) and
 * each entry shows title → meta → content in a typographic stack.
 */
export default function TimelineItem({item}: {item: TimelineItem}) {
    const {title, date, location, content} = item;
    return (
        <li className="relative flex flex-col pb-10 last:pb-0 md:pl-2">
            {/* Dot marker centered on the parent timeline rail */}
            <span
                aria-hidden="true"
                className="absolute -left-[39px] top-2 h-3 w-3 rounded-full border-2 border-indigo-400 bg-neutral-900 shadow-[0_0_0_4px_rgba(99,102,241,0.12)]"
            />
            <h3 className="text-lg font-bold text-white sm:text-xl">{title}</h3>
            <div className="mt-1 flex flex-wrap items-center gap-x-2 text-sm text-neutral-400">
                <span className="font-medium italic text-indigo-300">{location}</span>
                <span aria-hidden="true" className="text-neutral-600">·</span>
                <span className="font-mono text-xs tracking-wide text-neutral-500 sm:text-sm">{date}</span>
            </div>
            <div className="mt-3 text-sm leading-relaxed text-neutral-300 sm:text-base">{content}</div>
        </li>
    );
}
