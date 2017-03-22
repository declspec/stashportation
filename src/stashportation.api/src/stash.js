'use strict';

const Tables = require('./config/tables');
const ValidationError = require('./errors/validation');
const NotFoundError = require('./errors/not-found');

const SELECT_FULL_SQL = `SELECT s.id, s.title, s.content, s.serialized_tags, s.date_created, s.date_modified FROM ${Tables.Stashes} s`;
const SELECT_SUMMARY_SQL = `SELECT s.id, s.title, s.serialized_tags FROM ${Tables.Stashes} s`;

const INSERT_STASH_TAGS_SQL = `INSERT INTO ${Tables.StashTags} (stash_id, tag_id) VALUES (?,?)`;

const INSERT_SQL = `INSERT INTO ${Tables.Stashes} (title, content, serialized_tags) VALUES(?,?,?)`;
const UPDATE_SQL = `
    UPDATE ${Tables.Stashes}
    SET title = ?,
        content = ?,
        serialized_tags = ?,
        date_modified = CURRENT_TIMESTAMP
    WHERE id = ?
    `;



module.exports = function(tagService, db, config) {
    return new StashService(tagService, db);
};

class StashService {
    constructor(tagService, db) {
        this.$db = db;
        this.$tagService = tagService;
    }

    create(stash) {
        return this.$validate(stash).then(() => Promise.all([
            this.$tagService.findOrCreate(stash.tags),
            this.$db.run(INSERT_SQL, [ stash.title, stash.content, JSON.stringify(stash.tags) ])
        ])).then(([ tags, res ]) => {
            stash.id = res.lastID;
            return this.$mapTags(stash, [], tags);
        }).then(() => stash.id);
    }

    update(id, stash) {
        return this.$validate(stash)
            .then(() => this.findById(id))
            .then(ensureExists)
            .then(old => Promise.all([
                this.$db.run(UPDATE_SQL, [ stash.title, stash.content, JSON.stringify(stash.tags), stash.id ]),
                this.$tagService.findOrCreate(stash.tags)
                    .then(tags => this.$mapTags(stash, old.tags, tags))
            ]));
    }

    findById(id) {
        return this.$findWhere('s.id = ?', id)
            .then(rows => rows.length === 1 ? rows[0] : null);
    }

    findByQuery(query) {
        query = '%' + query.replace(/([%_])/g, '\\$1') + '%';
        return this.$findSummariesWhere(`s.title LIKE ?`, query);
    }

    findByTag(tag) {
        tag = tag.toLowerCase();
        return this.$findSummariesWhere(`EXISTS(SELECT 1 FROM ${Tables.StashTags} st INNER JOIN ${Tables.Tags} t ON t.id = st.tag_id WHERE st.stash_id = s.id AND t.tag = ?)`, tag);
    }

    $findWhere(condition, params) {
        return this.$db.all(`${SELECT_FULL_SQL} WHERE ${condition}`, params)
            .then(mapRows);
    }

    $findSummariesWhere(condition, params) {
        return this.$db.all(`${SELECT_SUMMARY_SQL} WHERE ${condition}`, params)
            .then(mapRows);
    }    

    $mapTags(stash, existingTags, allTags) {
        const refs = {};

        stash.tags.forEach(t => refs[t] = (refs[t]||0)+1);
        existingTags.forEach(t => refs[t] = (refs[t]||0)-1);

        const tagLookup = {};
        allTags.forEach(t => tagLookup[t.tag] = t.id);

        let kept = [],
            promises = [],
            deleted = 0;

        for(var tag in refs) {
            const count = refs[tag];
            if (count === 0) 
                kept.push(tagLookup[tag]);
            else if (count < 0)
                deleted++;
            else {
                promises.push(this.$db.run(INSERT_STASH_TAGS_SQL, [ stash.id, tagLookup[tag] ])
                    .then(res => res.lastID));
            }
        }

        return Promise.all(promises).then(results => {
            if (deleted === 0)
                return;

            kept = kept.concat(results);
            kept.push(stash.id);

            const deleteSql = kept.length > 1
                ? `DELETE FROM ${Tables.StashTags} WHERE tag_id NOT IN (${Array(kept.length-1).fill('?').join()}) AND stash_id = ?`
                : `DELETE FROM ${Tables.StashTags} WHERE stash_id = ?`;

            return this.$db.run(deleteSql, kept);
        });
    }

    $validate(stash) {
        if (!stash.content)
            return Promise.reject(new ValidationError('Stash content missing'));
        
        if (typeof(stash.content) !== 'string')
            return Promise.reject(new ValidationError('Invalid stash content provided'));

        if (!stash.title) 
            return Promise.reject(new ValidationError('Stash title missing'));

        if (typeof(stash.title) !== 'string')
            return Promise.reject(new ValidationError('Invalid stash title provided'));

        if (stash.title.length > 500)
            return Promise.reject(new ValidationError('Stash title must be less than 500 characters'));
        
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