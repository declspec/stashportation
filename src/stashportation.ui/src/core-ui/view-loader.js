import { inject } from 'core';

import 'styles/view-loader.scss';

@inject('$q')
export class ViewLoaderService {
    constructor(promise) {
        this.promise = promise;
        this.promises = [];
    }

    push(promise) {
        this.promises.push(promise);
        return promise;
    };

    enqueue(resolver) {
        if (typeof(resolver) !== 'function')
            throw new TypeError('resolver must be a callable function');

        var newPromise = this.promises.length > 0
            ? this.promise.all(this.promises).then(resolver)
            : this.promise.when(resolver());

        this.promises = [ newPromise ];
        return newPromise;
    };

    waitAll() {
        return this.promise.all(this.promises);
    };

    clear() {
        this.promises.length = 0;
    };
};

export function ViewLoaderDirective(viewLoaderService) { 
    this.viewLoaderService = viewLoaderService;
}

ViewLoaderDirective.prototype = {
    restrict: 'ECA',
    priority: 0,
    dependencies: [ 'ViewLoaderService' ],
    link: function(scope, $element) {
        this.viewLoaderService.waitAll()
            .then(() => $element.addClass('loaded'));
    }
}