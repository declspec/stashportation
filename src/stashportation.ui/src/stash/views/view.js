import { inject } from 'core';

@inject('$state', 'StashService', 'ViewLoaderService')
export class ViewView {
    constructor(state, stashService, viewLoaderService) {
        viewLoaderService.push(stashService.findById(state.params.id))
            .then(stash => this.stash = stash);
    }
}