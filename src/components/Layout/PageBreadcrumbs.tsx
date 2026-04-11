import Breadcrumbs, {type Crumb} from '../Portfolio/Breadcrumbs';

/**
 * Page-level breadcrumb strip, always rendered in the same visual slot:
 * flush below the fixed header, left-aligned inside a max-w-screen-xl container.
 *
 * Positioned absolutely so the strip never pushes hero content around, which
 * keeps the home-page `h-screen` hero intact while still giving every other
 * page a consistent breadcrumb location. The parent element must be
 * `position: relative` for this to anchor correctly — in practice that's the
 * `<main>` element of each page.
 */
export default function PageBreadcrumbs({items}: {items: Crumb[]}) {
    return (
        <div className="pointer-events-none absolute inset-x-0 top-0 z-20 px-4 pt-20 sm:px-6 sm:pt-24 lg:px-8">
            <div className="pointer-events-auto mx-auto max-w-screen-xl">
                <Breadcrumbs items={items} />
            </div>
        </div>
    );
}
