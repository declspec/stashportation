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

    getAllTags() {
        return this.promise.when([
            "javascript","java","c#","php","android","jquery","python","html","c++",
            "ios","css","mysql","sql","asp.net","objective-c","ruby-on-rails",".net",
            "c","angularjs","arrays","iphone","sql-server","json","ruby","r","ajax",
            "node.js","regex","xml","asp.net-mvc","linux","swift","django","wpf",
            "database","excel"
        ]);
    }

    getAll() {
        return this.promise.when(Object.keys(this.stashCache).map(key => this.stashCache[key]));
    }

    $loadCache() {
        this.stashCache = JSON.parse(sessionStorage.getItem('stashportation::stashCache') || '{}');
    }

    $saveCache() {
        sessionStorage.setItem('stashportation::stashCache', JSON.stringify(this.stashCache));
    }
}