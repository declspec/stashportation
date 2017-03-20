import markdownit from 'markdown-it';
import hljs from 'highlight.js';

 // Configure some shorthand overrides
const LANGUAGE_ALIASES = {
    'js': 'javascript',
    'html': 'xml',
    'c#': 'cs'
};

const MD = markdownit({
    html: true,
    highlight: function(code, lang) {
        if (LANGUAGE_ALIASES.hasOwnProperty(lang))
            lang = LANGUAGE_ALIASES[lang];

        if (lang && hljs.getLanguage(lang)) {
            try { return hljs.highlight(lang, code).value; }
            catch(e) { }
        }

        return '';
    }
});

MarkdownFilterProvider.$inject = [ '$sce' ];
export function MarkdownFilterProvider($sce) {
    return (str) => $sce.trustAsHtml(str ? MD.render(str) : '');
}
