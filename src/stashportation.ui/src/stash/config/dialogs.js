// Can't @inject functions
DialogConfig.$inject = ['$modalDialogProvider'];

export function DialogConfig(modalDialogProvider) {
    modalDialogProvider.register('edit-tags', {
        templateUrl: require('../dialogs/edit-tags.html'),
        controller: 'DefaultDialog',
        controllerAs: 'vm'
    });
}
