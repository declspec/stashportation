import CodeMirror from 'codemirror';

export function CodeEditorDirective() { }

CodeEditorDirective.prototype = {
    require: 'ngModel',
    link: function(scope, element, attrs, ngModel) {
        var config = scope.$eval(attrs['codeEditor']) || {},
            editor = createEditor(element[0], config);
            
        editor.on('changes', update);
        scope.$on('$destroy', () => editor.off('changes', update));
        ngModel.$render = () => editor.setValue(ngModel.$viewValue || '');

        function update() {
            ngModel.$setViewValue(editor.getValue());
        }
    }
};

function createEditor(element, config) {
    const editor = CodeMirror(element, config);

    // Add tabs-as-spaces functionality to the editor
    editor.addKeyMap({
        'Tab': function (cm) {
            if (cm.somethingSelected()) {
                var sel = editor.getSelection('\n');
                // Indent only if there are multiple lines selected, or if the selection spans a full line
                if (sel.length > 0 && (sel.indexOf('\n') > -1 || sel.length === cm.getLine(cm.getCursor().line).length)) {
                    cm.indentSelection('add');
                    return;
                }
            }

            cm.execCommand(cm.options.indentWithTabs ? 'insertTab' : 'insertSoftTab');
        },
        'Shift-Tab': function (cm) {
            cm.indentSelection('subtract');
        }
    });

    return editor;
}