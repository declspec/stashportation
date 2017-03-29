// Can't @inject functions
import 'styles/modal-dialog.scss';

DialogConfig.$inject = ['$modalDialogProvider'];

export function DialogConfig(modalDialogProvider) {
    modalDialogProvider.register('edit-tags', {
        templateUrl: require('../dialogs/edit-tags.html'),
        controller: 'DefaultDialog',
        controllerAs: 'vm'
    });
}
