export function CutFilter(str, length) {
    if (length < str.length)
        str = str.substring(0, length) + '…';
    return str;
}