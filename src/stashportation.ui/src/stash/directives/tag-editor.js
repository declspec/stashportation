export function TagEditorDirective() { }

TagEditorDirective.prototype = {
    restrict: 'A',
    require: '^ngModel',
    link: function(scope, $element, attrs, ngModelController) {
        ngModelController.$formatters.push(tagFormatter);
        ngModelController.$parsers.push(tagParser);
    }
};

function tagParser(value) {
    const split = value.split(/\s+/);
    const tags = [];

    for(var i = 0, j = split.length; i < j; ++i) {
        const tag = split[i].toLowerCase();
        if (tag.length && tags.indexOf(tag) < 0)
            tags.push(tag);
    }

    return tags;
}

function tagFormatter(value) {
    return Array.isArray(value) ? value.join(' ') : '';
}