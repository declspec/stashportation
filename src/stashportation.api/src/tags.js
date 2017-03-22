'use strict';

const Tables = require('./config/tables');

const SELECT_SQL = `SELECT id, tag FROM ${Tables.Tags}`;
const INSERT_SQL = `INSERT INTO ${Tables.Tags} (tag) VALUES(?)`;

module.exports = function(db, config) {
    return new TagsService(db);
};

class TagsService {
    constructor(db) {
        this.$db = db;
    }

    findAll() {
        return this.$db.all(`${SELECT_SQL} ORDER BY tag`)
            .then(rows => rows.map(r => r.tag));
    }

    findOrCreate(tags) {
        const sql = `${SELECT_SQL} WHERE tag IN(${Array(tags.length).fill('?').join()})`;

        return this.$db.all(sql, tags).then(rows => {
            // Create the missing tags
            const insertPromises = tags.filter(tag => rows.findIndex(r => r.tag === tag) < 0).map(tag => {
                return this.$db.run(INSERT_SQL, tag).then(v => ({ id: v.lastID, tag: tag }));
            });

            return Promise.all(insertPromises).then(results => rows.concat(results));
        });
    }
}