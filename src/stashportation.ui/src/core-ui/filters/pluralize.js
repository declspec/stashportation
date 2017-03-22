export function PluralizeFilter(count, singular, plural) {
    if ('undefined' === typeof(count))
        return undefined;

    const num = count|0;
    return (count === 1 ? singular : singular + (plural||'s'));
}