import { inject } from 'core';

@inject('$state', 'StashService')
export class ViewView {
    constructor(state, stashService) {
        stashService.get(state.params.id).then(stash => {
            this.stash = stash;
        });
    }
}