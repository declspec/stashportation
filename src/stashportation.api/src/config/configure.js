'use strict';

const express = require('express');
const chalk = require('chalk');
const sqlite = require('sqlite');
const bodyParser = require('body-parser');
const path = require('path');
const fs = require('fs');

module.exports = function(environment) {
    const config = getConfig(environment);

    return sqlite.open(config.database.path)
        .then(db => db.migrate(config.database.migrations))
        .then(db => configureApplication(db, config));
}

function configureApplication(db, config) {
    const app = express();

    if (config.environment === 'development') {
        // Add logging to each request in development
        app.use(logRequest);
    }

    app.use(bodyParser.json());

    // Attach the objects to the application
    app.db = db;
    app.config = config;

    return app;
}

function logRequest(req, res, next) {
    const end = res.end;
    const start = new Date();

    res.end = function() {
        console.log(`${req.method} ${req.url} - ${formatStatusCode(res.statusCode)} - ${(new Date()) - start}ms`);
        return end.apply(res, arguments);
    };

    return next();
}

function formatStatusCode(code) {
    if (code >= 500)
        return chalk.red(code);
    if (code >= 400)
        return chalk.yellow(code);
    if (code >= 300)
        return chalk.cyan(code);
    if (code >= 200)
        return chalk.green(code);
    return code;
}

function getConfig(env) {
    var defaults = require('./env/default'),
        target = path.resolve(__dirname, `./env/${env.toLowerCase()}.js`),
        config = { environment: env };
        
    if (fs.existsSync(target))
        return Object.assign(config, defaults, require(target));
    else {
        console.error(chalk.yellow(`warning: configuration for '${env}' not found, using defaults instead`));
        return Object.assign(config, defaults);
    }
};