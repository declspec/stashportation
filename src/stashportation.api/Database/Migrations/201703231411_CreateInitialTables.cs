using Dapper;
using System.Data;

namespace Stashportation.Database.Migrations {
    public class CreateInitialTables : IMigration
    {
        public long Version { get { return 201703231411; } }

        public void Up(IDbConnection connection) {
            connection.Execute(@"CREATE TABLE stashes (
                id              INTEGER PRIMARY KEY,
                title           TEXT NOT NULL,
                content         TEXT NOT NULL,
                serialized_tags TEXT NOT NULL,

                date_created    TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
                date_modified   TIMESTAMP
            )");

            connection.Execute(@"CREATE TABLE tags (
                id              INTEGER PRIMARY KEY,
                name             TEXT NOT NULL UNIQUE,
                date_created    TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL
            )");

            connection.Execute(@"CREATE TABLE stash_tags (
                stash_id        INTEGER NOT NULL,
                tag_id          INTEGER NOT NULL,
                PRIMARY KEY(stash_id, tag_id),
                FOREIGN KEY(stash_id) REFERENCES stashes(id) ON DELETE CASCADE,
                FOREIGN KEY(tag_id) REFERENCES tags(id)
            ) WITHOUT ROWID");
        }

        public void Down(IDbConnection connection) {
            connection.Execute("DROP TABLE stash_tags");
            connection.Execute("DROP TABLE tags");
            connection.Execute("DROP TABLE stashes");
        }
    }
}
