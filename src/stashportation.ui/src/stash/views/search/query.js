import { inject } from 'core';

@inject('$state', 'StashService', 'ViewLoaderService')
export class SearchQueryView {
    constructor(state, stashService, viewLoaderService) {
        this.searchTerm = state.params.q;

        viewLoaderService.push(stashService.findByQuery(this.searchTerm))
            .then(results => this.results = results);
    }
}