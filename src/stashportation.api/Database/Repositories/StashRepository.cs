using Dapper;
using Newtonsoft.Json;
using Stashportation.Database.Entities;
using Stashportation.Models;
using System;
using System.Threading.Tasks;

namespace Stashportation.Database.Repositories {
    public interface IStashRepository {
        Task<long> Create(Stash model);
    }

    public class StashRepository : IStashRepository {
        private static readonly string InsertStashQuery = GetInsertStashQuery();
        private static readonly string InsertStashTagsQuery = GetInsertStashTagsQuery();

        private readonly IDbConnectionProvider _connectionProvider;

        public StashRepository(IDbConnectionProvider connectionProvider) {
            _connectionProvider = connectionProvider;
        }

        public async Task<long> Create(Stash model) {
            using (var connection = _connectionProvider.GetConnection())
            using (var transaction = connection.BeginTransaction()) {
                var entity = ToEntity(model);
                entity.DateCreated = DateTime.UtcNow;

                var stashId = await connection.ExecuteScalarAsync<long>(InsertStashQuery, entity, transaction);
                await connection.ExecuteAsync(InsertStashTagsQuery, new { StashId = stashId, Tags = model.Tags }, transaction);

                return stashId;
            }
        }

        private static string GetInsertStashQuery() {
            return $@"INSERT INTO { Tables.Stashes } (title, content, serialized_tags, date_created) VALUES(:Title, :Content:, :SerializedTags, :DateCreated)";
        }

        private static string GetInsertStashTagsQuery() {
            return $"INSERT INTO {Tables.StashTags} (stash_id, tag_id) SELECT :StashId AS stash_id, id AS tag_id FROM {Tables.Tags} WHERE tag IN(:Tags)";
        }

        private static StashEntity ToEntity(Stash model) {
            return new StashEntity() {
                Id = model.Id,
                Title = model.Title,
                Content = model.Content,
                SerializedTags = model.Tags != null ? JsonConvert.SerializeObject(model.Tags) : null
            };
        }
    }
}
