import type {TimelineItem} from '../../../data/dataDef';

export default function TimelineItem({item}: {item: TimelineItem}) {
    const {title, date, location, content} = item;
    return (
        <div className="flex flex-col pb-8 text-center last:pb-0 md:text-left">
            <div className="flex flex-col pb-4">
                <h2 className="text-xl font-bold">{title}</h2>
                <div className="flex items-center justify-center gap-x-2 md:justify-start">
                    <span className="flex-1 text-sm font-medium italic sm:flex-none">{location}</span>
                    <span>&bull;</span>
                    <span className="flex-1 text-sm sm:flex-none">{date}</span>
                </div>
            </div>
            {content}
        </div>
    );
}
