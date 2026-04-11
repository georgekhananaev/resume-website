import {ChevronRightIcon} from '@heroicons/react/24/outline';
import Link from 'next/link';

export interface Crumb {
    label: string;
    href?: string;
}

export default function Breadcrumbs({items}: {items: Crumb[]}) {
    return (
        <nav aria-label="Breadcrumb" className="text-sm">
            <ol className="flex flex-wrap items-center gap-1 text-neutral-400">
                {items.map((item, idx) => {
                    const isLast = idx === items.length - 1;
                    return (
                        <li className="flex items-center gap-1" key={`${item.label}-${idx}`}>
                            {idx > 0 && <ChevronRightIcon aria-hidden="true" className="h-3.5 w-3.5 text-neutral-600" />}
                            {isLast || !item.href ? (
                                <span aria-current={isLast ? 'page' : undefined} className="text-neutral-300">
                                    {item.label}
                                </span>
                            ) : (
                                <Link className="transition-colors hover:text-indigo-400" href={item.href}>
                                    {item.label}
                                </Link>
                            )}
                        </li>
                    );
                })}
            </ol>
        </nav>
    );
}
