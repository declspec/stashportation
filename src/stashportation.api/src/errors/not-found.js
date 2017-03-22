'use strict';

module.exports = NotFoundError;

function NotFoundError(message) {
    const error = Error.call(this, message);

    Object.assign(this, error);
    this.name = error.name = 'NotFoundError';

    Object.defineProperty(this, 'stack', { 
        get: () => error.stack,
        configurable: true
    });
}

NotFoundError.prototype = Object.create(Error.prototype, {
    constructor: {
        value: NotFoundError,
        writable: true,
        configurable: true
    }
});