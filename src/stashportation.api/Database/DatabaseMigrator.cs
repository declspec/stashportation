﻿using System;
using System.Data;
using Dapper;
using System.Reflection;
using System.Linq;
using System.Collections.Generic;
using Stashportation.Database.Migrations;

namespace Stashportation.Database {
    public class DatabaseMigrator {

        private const string CREATE_VERSION_INFO_TABLE =
            @"CREATE TABLE IF NOT EXISTS version_info (
                version         INTEGER PRIMARY KEY,
                title           TEXT NOT NULL,
                date_created    TIMESTAMP NOT NULL
            ) WITHOUT ROWID";

        private readonly IDbConnection _connection;
        private readonly Assembly _migrationAssembly;

        public DatabaseMigrator(IDbConnection connection, Assembly migrationAssembly) {
            _connection = connection;
            _migrationAssembly = migrationAssembly;
        }

        public void MigrateToLatest() {
            MigrateTo(long.MaxValue);
        }

        public void MigrateTo(long version) {
            // First, ensure the table exists
            _connection.Execute(CREATE_VERSION_INFO_TABLE);
            var latest = _connection.ExecuteScalar<long>("SELECT MAX(version) FROM version_info");

            if (version > latest)
                MigrateUpTo(version, latest);
            else
                MigrateDownTo(version);
        }

        private void MigrateUpTo(long version, long from) {
            var migrationType = typeof(IMigration);
            var completed = new Stack<MigrationOperation>();

            var operations = _migrationAssembly.GetTypes()
                .Where(t => migrationType.IsAssignableFrom(t) && t.GetConstructor(Type.EmptyTypes) != null)
                .Select(CreateMigrationOperation)
                .Where(op => op.Version > from && op.Version < version)
                .OrderBy(op => op.Version);

            try {
                foreach (var operation in operations) {
                    operation.Migration.Up(_connection);
                    completed.Push(operation);
                    _connection.Execute("INSERT INTO version_info(version,title,date_created) VALUES(@version,@title,current_timestamp)", new { version = operation.Version, title = operation.Title });
                }
            }
            catch (Exception) {
                // Attempt to rollback
                Rollback(completed);
                throw; // Bubble the exception
            }
        }

        private void MigrateDownTo(long version) {
            var migrationType = typeof(IMigration);
            var completed = new Stack<MigrationOperation>();

            var todo = _connection.Query<long>("SELECT version FROM version_info WHERE version > @Version", new { Version = version });

            var operations = _migrationAssembly.GetTypes()
                .Where(t => migrationType.IsAssignableFrom(t) && t.GetConstructor(Type.EmptyTypes) != null)
                .Select(CreateMigrationOperation)
                .Where(op => todo.Contains(op.Version))
                .OrderByDescending(op => op.Version);

            try {
                foreach (var operation in operations) {
                    operation.Migration.Down(_connection);
                    completed.Push(operation);
                    _connection.Execute("DELETE FROM version_info WHERE version = @Version", new { Version = operation.Version });
                }
            }
            catch (Exception) {
                // Attempt to rollback
                Rollup(completed);
                throw; // Bubble the exception
            }
        }

        private void Rollback(Stack<MigrationOperation> migrations) {
            var lastSuccessful = long.MaxValue;

            try {
                while (migrations.Count > 0) {
                    var current = migrations.Pop();
                    current.Migration.Down(_connection);
                    lastSuccessful = current.Version;
                }
            }
            finally {
                // Even an exception occurs during one of the 'Down' migrations, ensure that the 'version_info' table is up-to-date
                _connection.Execute("DELETE FROM version_info WHERE version >= @last", new { last = lastSuccessful });
            }
        }

        private void Rollup(Stack<MigrationOperation> migrations) {
            while (migrations.Count > 0) {
                var current = migrations.Pop();
                current.Migration.Up(_connection);
                _connection.Execute("INSERT INTO version_info(version,title,date_created) VALUES(@version,@title,current_timestamp)", new { version = current.Version, title = current.Title });
            }
        }

        private static MigrationOperation CreateMigrationOperation(Type type) {
            var migration = (IMigration)Activator.CreateInstance(type);
            return new MigrationOperation(migration, migration.Version, type.Name);
        }

        private class MigrationOperation {
            public IMigration Migration { get; }
            public long Version { get; }
            public string Title { get; }

            public MigrationOperation(IMigration migration, long version, string title) {
                Migration = migration;
                Version = version;
                Title = title;
            }
        }
    }
}