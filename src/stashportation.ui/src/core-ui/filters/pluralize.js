export function PluralizeFilter(count, singular) {
    if ('undefined' === typeof(count))
        return undefined;
        
    const num = count|0;
    return num+' '+(count === 1 ? singular : singular + 's');
}