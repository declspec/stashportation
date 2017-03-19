import { inject } from 'core';

import 'styles/form.scss';

const EDITOR_OPTIONS = {
    lineNumbers: true,
    mode: 'gfm',
    theme: 'github',
    lineWrapping: false
};

@inject('$state', 'StashService')
export class EditView {
    constructor(state, stashService) {
        this.state = state;
        this.stashService = stashService;

        this.options = EDITOR_OPTIONS;
        this.settings = {};

        if (!state.params.id || state.params.stash) 
            this.stash = state.params.stash || {};
        else {
            this.stashService.get(state.params.id)
                .then(stash => this.stash = stash);
        }
    }

    toggle(setting) {
        this.settings[setting] = !this.settings[setting];
    }

    isActive(setting) {
        return !!this.settings[setting];
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

        return promise.finally(() => this.saving = false);
    }
}