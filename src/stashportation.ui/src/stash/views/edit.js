import { inject } from 'core';
import { DialogResult } from 'ng-modal-dialog';

import 'codemirror/mode/gfm/gfm';
import 'styles/form.scss';

const EDITOR_OPTIONS = {
    lineNumbers: true,
    mode: 'gfm',
    theme: 'github',
    lineWrapping: false
};

@inject('$state', '$modalDialog', 'StashService', 'ViewLoaderService')
export class EditView {
    constructor(state, modalDialog, stashService, viewLoaderService) {
        this.state = state;
        this.modalDialog = modalDialog;
        this.stashService = stashService;

        this.options = EDITOR_OPTIONS;
        this.settings = { };

        if (!state.params.id || state.params.stash) 
            this.stash = state.params.stash || {};
        else {
            viewLoaderService.push(this.stashService.findById(state.params.id))
                .then(stash => stash ? (this.stash = stash) : state.go('new'));
        }
    }

    toggle(setting) {
        this.settings[setting] = !this.settings[setting];
    }

    isActive(setting) {
        return !!this.settings[setting];
    }

    showTagPrompt() {
        this.modalDialog.show('edit-tags', { tags: this.stash.tags }, (result, scope) => {
            if (result === DialogResult.Success)
                this.stash.tags = scope.tags;
        });
    }

    save() {
        this.saving = true;
        let promise = null;

        if (this.stash.id)
            promise = this.stashService.save(this.stash);
        else {
            promise = this.stashService.create(this.stash).then(id => {
                this.stash.id = id;
                this.state.go('edit', { id: id, stash: this.stash });
            });
        }

        return promise.finally(() => {
            this.stash.tags = this.stash.tags.filter(unique);
            this.saving = false
        });
    }
}

function unique(value, index, array) {
    return array.indexOf(value) === index;
}