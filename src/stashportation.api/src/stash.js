'use strict';

const Tables = require('./config/tables');
const ValidationError = require('./errors/validation');
const NotFoundError = require('./errors/not-found');

const SELECT_FULL_SQL = `SELECT id, title, content, serialized_tags, date_created, date_modified FROM ${Tables.Stashes}`;
const SELECT_SUMMARY_SQL = `SELECT id, title, serialized_tags FROM ${Tables.Stashes}`;

const UPDATE_SQL = `
    UPDATE ${Tables.Stashes}
    SET title = ?,
        content = ?,
        serialized_tags = ?,
        date_modified = CURRENT_TIMESTAMP
    `;

const INSERT_SQL = `INSERT INTO ${Tables.Stashes} (title, content, serialized_tags) VALUES(?,?,?)`;

module.exports = function(tagService, db, config) {
    return new StashService(tagService, db);
};

class StashService {
    constructor(tagService, db) {
        this.$db = db;
        this.$tagService = tagService;
    }

    create(stash) {
        return this.$validate(stash)
            .then(() => this.$tagService.findOrCreate(stash.tags))
            .then(tags => {
                console.log(tags);
                return this.$db.run(INSERT_SQL, [ stash.title, stash.content, JSON.stringify(stash.tags) ])
                    .then(stmt => stmt.lastID);
            });
    }

    update(id, stash) {
        return this.$validate(stash)
            .then(() => this.findById(id))
            .then(ensureExists)
            .then(old => {
                return this.$tagService.findOrCreate(stash.tags).then(tags => {
                    console.log(tags);
                    return this.$db.run(UPDATE_SQL, [ stash.title, stash.content, JSON.stringify(stash.tags) ]);
                });
            });
    }

    findById(id) {
        return this.$findWhere('id = ?', id)
            .then(rows => rows.length === 1 ? rows[0] : null);
    }

    findByQuery(query) {
        query = query.replace(/([%_])/g, '\\$1');
        return this.$findSummariesWhere(`title LIKE ? ESCAPE '\\'`, query);
    }

    findByTag(tag) {
        tag = tag.toLowerCase();
        return this.$findSummariesWhere(`EXISTS(SELECT 1 FROM ${Tables.StashTags} st INNER JOIN ${Tables.Tags} t ON t.id = st.tag_id WHERE st.stash_id = id)`);
    }

    $findWhere(condition, params) {
        return this.$db.all(`${SELECT_FULL_SQL} WHERE ${condition}`, params)
            .then(mapRows);
    }

    $findSummariesWhere(condition, params) {
        return this.$db.all(`${SELECT_SUMMARY_SQL} WHERE ${condition}`, params)
            .then(mapRows);
    }    

    $validate(stash) {
        if (stash.content && typeof(stash.content) !== 'string')
            return Promise.reject(new ValidationError('Invalid stash content provided'));

        if (stash.title) {
            if (typeof(stash.title) !== 'string')
                return Promise.reject(new ValidationError('Invalid stash title provided'));

            if (stash.title.length > 500)
                return Promise.reject(new ValidationError('Stash title must be less than 500 characters'));
        }

        if (stash.tags) {
            if (!Array.isArray(stash.tags))
                return Promise.reject('Invalid stash tags provided');

            if (stash.tags.length > 20)
                return Promise.reject(new ValidationError('A stash cannot have more than 20 tags'));
        }
        
        return Promise.resolve();
    }
};

function ensureExists(stash) {
    if (!stash)
        throw new NotFoundError('Stash does not exist');
    return stash;
}  

function mapRows(rows) {
    return rows.map(mapRow);
}

function mapRow(row) {
    const mapped = {
        id: row.id,
        title: row.title,
        tags: JSON.parse(row.serialized_tags)
    };

    if (row.hasOwnProperty('content'))
        mapped.content = row.content;

    if (row.hasOwnProperty('date_modified'))
        mapped.dateModified = row.date_modified;

    if (row.hasOwnProperty('date_created'))
        mapped.dateModified = row.date_modified;

    return mapped;
}