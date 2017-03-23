using Dapper;
using Newtonsoft.Json;
using Stashportation.Database.Entities;
using Stashportation.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text.RegularExpressions;
using System.Threading.Tasks;

namespace Stashportation.Database.Repositories {
    public interface IStashRepository {
        Task Create(Stash model);
        Task Update(Stash model);
        Task<Stash> FindById(long id);
        Task<IList<StashSummary>> FindSummariesByTag(string tag);
        Task<IList<StashSummary>> FindSummariesByQuery(string query);
    }

    public class StashRepository : IStashRepository {
        private static readonly string InsertStashQuery = GetInsertStashQuery();
        private static readonly string InsertStashTagsQuery = GetInsertStashTagsQuery();
        private static readonly string UpdateStashQuery = GetUpdateStashQuery();
        private static readonly string SelectStashesQuery = GetSelectStashesQuery();
        private static readonly string SelectStashSummariesQuery = GetSelectStashSummariesQuery();
        private static readonly string SelectStashSummariesByTagQuery = GetSelectStashSummariesByTagQuery();

        private readonly IDbConnectionProvider _connectionProvider;
        private readonly Regex _escapeRegex = new Regex("([%_])", RegexOptions.Compiled);

        public StashRepository(IDbConnectionProvider connectionProvider) {
            _connectionProvider = connectionProvider;
        }

        public async Task Create(Stash model) {
            using (var connection = _connectionProvider.GetConnection())
            using (var transaction = connection.BeginTransaction()) {
                var entity = ToEntity(model);
                entity.DateCreated = DateTime.UtcNow;

                model.Id = await connection.ExecuteScalarAsync<long>(InsertStashQuery, entity, transaction);
                await connection.ExecuteAsync(InsertStashTagsQuery, model, transaction);
                transaction.Commit();
            }
        }

        public async Task Update(Stash model) {
            using (var connection = _connectionProvider.GetConnection())
            using (var transaction = connection.BeginTransaction()) {
                var entity = ToEntity(model);
                entity.DateModified = DateTime.UtcNow;

                await Task.WhenAll(
                    connection.ExecuteAsync(UpdateStashQuery, entity, transaction),
                    connection.ExecuteAsync($"DELETE FROM {Tables.StashTags} WHERE stash_id = :Id", entity, transaction)
                );

                await connection.ExecuteAsync(InsertStashTagsQuery, model, transaction);
                transaction.Commit();
            }
        }

        public async Task<Stash> FindById(long id) {
            using (var connection = _connectionProvider.GetConnection()) {
                var query = string.Format("{0} WHERE id = :Id", SelectStashesQuery);
                var stashes = await connection.QueryAsync<StashEntity>(query, new { Id = id });

                return stashes.Select(ToModel).SingleOrDefault();
            }
        }

        public async Task<IList<StashSummary>> FindSummariesByTag(string tag) {
            using (var connection = _connectionProvider.GetConnection()) {
                var entities = await connection.QueryAsync<StashEntity>(SelectStashSummariesByTagQuery, new { Tag = tag });
                return entities.Select(ToSummaryModel).ToList();
            }
        }

        public async Task<IList<StashSummary>> FindSummariesByQuery(string search) {
            var realSearch = string.Format("%{0}%", _escapeRegex.Replace(search, "\\$1"));
            var query = string.Format("{0} WHERE title LIKE :Search ESCAPE '\\'", SelectStashSummariesQuery);

            using(var connection = _connectionProvider.GetConnection()) {
                var entities = await connection.QueryAsync<StashEntity>(query, new { Search = realSearch });
                return entities.Select(ToSummaryModel).ToList();
            }
        }

        private static string GetInsertStashQuery() {
            return $@"INSERT INTO { Tables.Stashes } (title, content, serialized_tags, date_created) VALUES(@Title, @Content, @SerializedTags, @DateCreated);
                SELECT last_insert_rowid();";
        }

        private static string GetInsertStashTagsQuery() {
            return $"INSERT INTO {Tables.StashTags} (stash_id, tag_id) SELECT @Id AS stash_id, id AS tag_id FROM {Tables.Tags} WHERE name IN @Tags";
        }

        private static string GetUpdateStashQuery() {
            return $@"UPDATE {Tables.Stashes}
                SET title = :Title,
                    content = :Content,
                    serialized_tags = :SerializedTags,
                    date_modified = :DateModified
                WHERE id = :Id";
        }

        private static string GetSelectStashesQuery() {
            return string.Format("SELECT {0}.id, {0}.title, {0}.content, {0}.serialized_tags FROM {0}", Tables.Stashes);
        }

        private static string GetSelectStashSummariesQuery() {
            return string.Format("SELECT {0}.id, {0}.title, {0}.serialized_tags FROM {0}", Tables.Stashes);
        }

        private static string GetSelectStashSummariesByTagQuery() {
            return string.Format(
                "{0} WHERE EXISTS(SELECT 1 FROM {1} INNER JOIN {2} ON {2}.id = {1}.tag_id WHERE {1}.stash_id = {3}.id AND {2}.name = :Tag)", 
                SelectStashSummariesQuery, 
                Tables.StashTags, 
                Tables.Tags, 
                Tables.Stashes
            );
        }

        private static StashEntity ToEntity(Stash model) {
            return new StashEntity() {
                Id = model.Id,
                Title = model.Title,
                Content = model.Content,
                SerializedTags = model.Tags != null ? JsonConvert.SerializeObject(model.Tags) : null
            };
        }

        private static Stash ToModel(StashEntity entity) {
            return new Stash() {
                Id = entity.Id,
                Title = entity.Title,
                Content = entity.Content,
                Tags = entity.SerializedTags != null
                    ? JsonConvert.DeserializeObject<string[]>(entity.SerializedTags)
                    : null
            };
        }

        private static StashSummary ToSummaryModel(StashEntity entity) {
            return new StashSummary() {
                Id = entity.Id,
                Title = entity.Title,
                Tags = entity.SerializedTags != null
                    ? JsonConvert.DeserializeObject<string[]>(entity.SerializedTags)
                    : null
            };
        }
    }
}
