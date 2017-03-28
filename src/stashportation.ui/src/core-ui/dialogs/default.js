import { inject } from 'core';
import { DialogResult } from 'ng-modal-dialog';

@inject('$scope', '$modalDialogParams')
export class DefaultDialog {
    constructor(scope, modalDialogParams) {
        Object.assign(scope, modalDialogParams);

        scope.confirm = function() {
            let params = { };

            // Map any non-private, non-function properties from the scope to the output parameters for consumption
            for (var prop in scope) {
                if (prop[0] !== '$' && scope.hasOwnProperty(prop) && 'function' !== typeof(scope[prop]))
                    params[prop] = scope[prop];
            }

            scope.close(DialogResult.Success, params);
        };
    }
}