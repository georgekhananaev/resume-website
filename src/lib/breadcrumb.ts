/**
 * Build a Schema.org BreadcrumbList JSON-LD object from a list of labeled URLs.
 *
 * Uses the nested-item form recommended by strict validators: the `item`
 * property on each `ListItem` is a `WebPage` Thing with its own `@id`, `url`,
 * and `name`. Some validators (Google's Rich Results Test under strict mode,
 * Schema.org's validator, Yandex, Bing) traverse `item` as a Thing — when
 * `item` is a plain URL string they report "Unnamed item" because the URL
 * has no `name` attached. Wrapping it in an object with an explicit `name`
 * avoids the warning everywhere while staying valid Schema.org.
 *
 * The `name` is duplicated on both the outer ListItem and the inner WebPage
 * as a belt-and-suspenders guarantee: validators that read either position
 * get the same answer.
 */
export interface Breadcrumb {
    name: string;
    url: string;
}

export function buildBreadcrumbList(crumbs: Breadcrumb[]) {
    return {
        '@type': 'BreadcrumbList',
        itemListElement: crumbs.map((crumb, idx) => ({
            '@type': 'ListItem',
            position: idx + 1,
            name: crumb.name,
            item: {
                '@type': 'WebPage',
                '@id': crumb.url,
                url: crumb.url,
                name: crumb.name,
            },
        })),
    };
}
