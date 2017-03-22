-- up
CREATE TABLE stashes (
    id              INTEGER PRIMARY KEY,
    title           TEXT NOT NULL,
    content         TEXT NOT NULL,
    serialized_tags TEXT NOT NULL,

    date_created    TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    date_modified   TIMESTAMP
);

CREATE TABLE tags (
    id              INTEGER PRIMARY KEY,
    tag             TEXT NOT NULL UNIQUE,
    date_created    TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL
);

CREATE TABLE stash_tags (
    stash_id        INTEGER NOT NULL,
    tag_id          INTEGER NOT NULL,
    PRIMARY KEY(stash_id, tag_id),
    FOREIGN KEY(stash_id) REFERENCES stashes(id) ON DELETE CASCADE,
    FOREIGN KEY(tag_id) REFERENCES tags(id)
) WITHOUT ROWID;

-- down
DROP TABLE stash_tags;
DROP TABLE tags;
DROP TABLE stashes;