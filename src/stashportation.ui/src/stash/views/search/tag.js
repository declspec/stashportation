import { inject } from 'core';

@inject('$state', 'StashService', 'ViewLoaderService')
export class SearchTagView {
    constructor(state, stashService, viewLoaderService) {
        this.searchTerm = state.params.tag;

        viewLoaderService.push(stashService.findByTag(this.searchTerm))
            .then(results => this.results = results);
    }
}