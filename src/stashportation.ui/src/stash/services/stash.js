import { inject } from 'core';

@inject('WebApiService')
export class StashService {
    constructor( webApiService) {
        this.webApi = webApiService;
    }

    create(stash) {
        return this.webApi.post('/api/stash', stash);
    }

    save(stash) {
        return this.webApi.put(`/api/stash/${stash.id}`, stash);
    }

    findById(id) {
        return this.webApi.get(`/api/stash/${encodeURIComponent(id)}`)
            .then(res => res.status === 200 ? res.data : null);
    }

    findByQuery(query) {
        return this.webApi.get(`/api/stash?q=${encodeURIComponent(query)}`)
            .then(res => res.data);
    }

    findByTag(tag) {
        return this.webApi.get(`/api/stash/tags/${encodeURIComponent(tag.toLowerCase())}`)
            .then(res => res.data);
    }

    findAllTags() {
        return this.webApi.get(`/api/tags`)
            .then(res => res.data);
    }
}