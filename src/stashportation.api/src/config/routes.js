'use strict';

module.exports = function(app) {
    app.use('/', (req, res, next) => res.send('<h1>Hello, world</h1>'));
};