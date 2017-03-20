import markdownit from 'markdown-it';
import hljs from 'highlight.js';

 // Configure some shorthand overrides
const LANG_SHORTCUTS = {
    "js": "javascript",
    "html": "xml"
};

const MD = markdownit({
    html: true,
    highlight: function(code, lang) {
        if (LANG_SHORTCUTS.hasOwnProperty(lang))
            lang = LANG_SHORTCUTS[lang];

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
