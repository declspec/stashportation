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
        this.error = null;

        let currentId = this.stash.id;

        const promise = currentId 
            ? this.stashService.save(this.stash) 
            : this.stashService.create(this.stash);

        return promise.then(res => {
            if (res.status === 422) {
                this.error = res.errors[0] || "An unknown error occurred when saving. Please try again.";
                return;
            }

            if (!currentId) {
                this.stash.id = res.data;
                this.state.go('edit', { id: this.stash.id, stash: this.stash });
            }
        }).finally(() => this.saving = false);
    }
}

function unique(value, index, array) {
    return array.indexOf(value) === index;
}