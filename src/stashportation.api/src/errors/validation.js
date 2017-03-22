'use strict';

module.exports = ValidationError;

function ValidationError(message) {
    const error = Error.call(this, message);

    Object.assign(this, error);
    this.name = error.name = 'ValidationError';

    Object.defineProperty(this, 'stack', { 
        get: () => error.stack,
        configurable: true
    });
}

ValidationError.prototype = Object.create(Error.prototype, {
    constructor: {
        value: ValidationError,
        writable: true,
        configurable: true
    }
});