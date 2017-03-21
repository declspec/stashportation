export function PluralizeFilter(count, singular) {
    const num = count|0;
    return num+' '+(count === 1 ? singular : singular + 's');
}