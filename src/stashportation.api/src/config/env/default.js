'use strict';

module.exports = {
    port: 5002,
    database: {
        path: './bin/stashportation.db',
        migrations: {
            force: false,
            path: './migrations'
        }
    }
}