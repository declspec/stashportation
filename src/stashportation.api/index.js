'use strict';

const chalk = require('chalk');
const configure = require('./src/config/configure');
const routeConfig = require('./src/config/routes');

// Get the environment
if (!process.env.NODE_ENV) {
    console.error(chalk.yellow(`warning: NODE_ENV not set, defaulting to 'development' config`));
    process.env.NODE_ENV = 'development';
}

configure(process.env.NODE_ENV).then(app => {
    const tagService = require('./src/tags')(app.db, app.config);
    const stashService = require('./src/stash')(tagService, app.db, app.config);
    

    // Attach a new convenience method to the response
    app.use((req, res, next) => {
        res.sendWrapped = sendWrapped;
        return next();
    });

    // GET get all tags
    app.get('/api/tags', (req, res, next) => {
        tagService.findAll().then(tags => {
            res.sendWrapped(createSuccessResponse(200, tags));
        }, next);
    });

    // POST create a stash
    app.post('/api/stash', (req, res, next) => {
        stashService.create(req.body).then(id => {
            const response = createSuccessResponse(201, id);
            res.sendWrapped(response);
        }, next);
    });

    // PUT update a stash
    app.put('/api/stash/:id(\\d+)', (req, res, next) => {
        stashService.update(req.params.id, req.body).then(() => {
            res.sendWrapped(createSuccessResponse(200, null));
        }, next);
    });
    
    // GET stash by id
    app.get('/api/stash/:id(\\d+)', (req, res, next) => {
        stashService.findById(req.params.id).then(stash => {
            const response = createSuccessResponse(stash !== null ? 200 : 404, stash);
            res.sendWrapped(response)
        }, next);
    });

    // GET stashes by tag
    app.get('/api/stash/tags/:tag', (req, res, next) => {
        stashService.findByTag(req.params.tag).then(stashes => {
            res.sendWrapped(createSuccessResponse(200, stashes));
        }, next);
    });

    // GET stashes by a query (must have query param)
    app.get('/api/stash', (req, res, next) => {
        if (!req.query.q)
            return next();

        return stashService.findByQuery(req.query.q).then(stashes => {
            res.sendWrapped(createSuccessResponse(200, stashes))
        }, next);
    });

    // Global error handler to transform errors into safe(ish) JSON responses
    app.use((err, req, res, next) => res.sendWrapped(wrapError(err)));

    // Global 'not found' route
    app.use((req, res, next) => res.sendWrapped(createErrorResponse(404, 'Unknown resource requested')));

    // Begin listening
    app.listen(app.config.port, "0.0.0.0", () => {
        console.log(chalk.green(`notice: application is running on port ${app.config.port}`));
        process.on('exit', () => app.db.close());
    });
}).catch(err => {
    console.error(chalk.red(`fatal: ${err.message}`));
});

// --
// Response Helpers
// --
function sendWrapped(response) {
    this.status(response.status);
    this.send(response);
}

function wrapError(err) {
    if (typeof(err) !== 'object' || !err.name || !err.message) {
        console.error(err);
        return createErrorResponse(500, 'An unexpected error has occurred');
    }   

    switch(err.name) {
    case 'ValidationError':
        return createErrorResponse(429, err.messages || err.message);
    case 'NotFoundError':
        return createErrorResponse(404, err.message);
    case 'UserFriendlyError':
        if (err.innerError) logError(err.innerError);
        return createErrorResponse(500, err.message);
    default:
        logError(err);
        return createErrorResponse(500, 'An unexpected error has occurred');
    }
}

function createSuccessResponse(status, data) {
    return { status: status, data: data, errors: null };
}

function createErrorResponse(status, message) {
    return { 
        status: status, 
        data: null, 
        errors: Array.isArray(message) ? message : [ message ] 
    };
}

function logError(err) {
    console.error(err.stack);
}