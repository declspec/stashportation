import { inject } from 'core';

@inject('$q', 'WebApiService')
export class StashService {
    constructor(q, webApiService) {
        this.promise = q;
        this.webApi = webApiService;

        this.$loadCache();
        this.$$id = Object.keys(this.stashCache).reduce((maxId, id) => Math.max(maxId, id), 0);
    }

    create(stash) {
        stash.id = ++this.$$id;

        this.stashCache[stash.id] = stash;
        this.$saveCache();

        return this.promise.when(stash.id);
    }

    save(stash) {
        if (this.stashCache[stash.id] !== stash)
            this.stashCache[stash.id] = stash;
            
        this.$saveCache();
        return this.promise.when();
    }

    get(id) {
        return this.promise.when(this.stashCache[id] || null);
    }

    $loadCache() {
        this.stashCache = JSON.parse(sessionStorage.getItem('stashportation::stashCache') || '{}');
    }

    $saveCache() {
        sessionStorage.setItem('stashportation::stashCache', JSON.stringify(this.stashCache));
    }
}