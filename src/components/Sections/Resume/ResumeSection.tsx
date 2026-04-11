import {ReactNode} from 'react';

/**
 * Editorial subsection row used inside /#resume — left column monospace label,
 * right column content. Matches the label pattern used by FavoriteTech and
 * GithubStats so all dark editorial sections feel like one family.
 */
export default function ResumeSection({title, children}: {title: string; children: ReactNode}) {
    return (
        <div className="grid grid-cols-1 gap-y-6 sm:grid-cols-[160px_1fr] sm:gap-x-10 sm:gap-y-0">
            <div className="sm:pt-1">
                <p className="font-mono text-xs font-bold uppercase tracking-widest text-indigo-400/80 sm:text-sm">
                    {title}
                </p>
            </div>
            <div className="flex flex-col">{children}</div>
        </div>
    );
}
