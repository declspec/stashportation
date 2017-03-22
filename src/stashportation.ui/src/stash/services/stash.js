import { inject } from 'core';

const REQUEST_LATENCY = 1000;

@inject('$q', '$timeout', 'WebApiService')
export class StashService {
    constructor(q, delay, webApiService) {
        this.promise = q;
        this.webApi = webApiService;
        this.delay = delay;

        this.$loadCache();
        this.$$id = Object.keys(this.stashCache).reduce((maxId, id) => Math.max(maxId, id), 0);
    }

    create(stash) {
        return this.webApi.post('/api/stash', stash).then(res => res.data);


        stash.id = ++this.$$id;

        this.stashCache[stash.id] = stash;
        this.$saveCache();

        return this.promise.when(stash.id);
    }

    save(stash) {
        return this.webApi.put(`/api/stash/${stash.id}`, stash);

        if (this.stashCache[stash.id] !== stash)
            this.stashCache[stash.id] = stash;
            
        this.$saveCache();
        return this.promise.when();
    }

    findById(id) {
        return this.delay(() => this.stashCache[id] || null, REQUEST_LATENCY);
    }

    findByQuery(query) {
        const lowerQuery = query.toLowerCase();
        return this.delay(() => Object.values(this.stashCache).filter(s => s.title.toLowerCase().indexOf(lowerQuery) >= 0), REQUEST_LATENCY);
    }

    findByTag(tag) {
        const lowerTag = tag.toLowerCase();
        return this.delay(() => Object.values(this.stashCache).filter(s => s.tags.indexOf(lowerTag) >= 0), REQUEST_LATENCY);
    }

    findAll() {
        return this.delay(() => Object.values(this.stashCache), REQUEST_LATENCY);
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

    $loadCache() {
        this.stashCache = JSON.parse(sessionStorage.getItem('stashportation::stashCache') || '{}');
    }

    $saveCache() {
        sessionStorage.setItem('stashportation::stashCache', JSON.stringify(this.stashCache));
    }
}