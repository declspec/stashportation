export function TagEditorDirective() { }

TagEditorDirective.prototype = {
    restrict: 'A',
    require: ['^ngModel','?^ngModelOptions'],
    template: '<input class="input-box borderless-input" type="text" />',
    link: function(scope, $element, attrs, ctrls) {
        const ngModel = ctrls[0];
        const ngModelOptions = ctrls[1];

        let input = $element[0].firstChild,
            debounce = ngModelOptions && ngModelOptions.$options.getOption('debounce'),
            timeout = null;

        ngModel.$render = onChange;
        onChange();

        input.addEventListener('input', () => {
            if (!debounce || debounce <= 0)
                return onInput();

            if (timeout)
                clearTimeout(timeout);
            timeout = setTimeout(onInput, debounce);
        });

        function onInput() {
            timeout = null;
            const newValue = input.value.split(/\s+/).map(s => s.toLowerCase());
            ngModel.$setViewValue(newValue);
        }

        function onChange() {
            const value = ngModel.$viewValue || ngModel.$modelValue;
            input.value = value ? value.join(' ') : '';
        }
    }
}