using System;
using System.Linq;
using System.Threading.Tasks;
using System.Collections.Generic;
using Dapper;
using Stashportation.Database.Entities;
using Stashportation.Models;

namespace Stashportation.Database.Repositories {
    public interface ITagRepository {
        Task CreateAll(IList<string> tags);
        Task<IList<Tag>> FindAll();
    }

    public class TagRepository : ITagRepository {
        private static readonly string InsertTagQuery = GetInsertTagQuery();
        private static readonly string SelectTagsQuery = GetSelectTagsQuery();
        private static readonly string SelectOrderedTagsQuery = string.Format("{0} ORDER BY name", SelectTagsQuery);

        private readonly IDbConnectionProvider _connectionProvider;

        public TagRepository(IDbConnectionProvider connectionProvider) {
            _connectionProvider = connectionProvider;
        }

        public async Task CreateAll(IList<string> tags) {
            using (var connection = _connectionProvider.GetConnection())
            using (var transaction = connection.BeginTransaction()) {
                var now = DateTime.UtcNow;

                var inserts = tags.Select(tag => {
                    var entity = new TagEntity() { Name = tag, DateCreated = now };
                    return connection.ExecuteAsync(InsertTagQuery, entity, transaction);
                });

                await Task.WhenAll(inserts.ToArray());
            }
        }

        public async Task<IList<Tag>> FindAll() {
            using (var connection = _connectionProvider.GetConnection()) {
                var entities = await connection.QueryAsync<TagEntity>(SelectOrderedTagsQuery);
                return entities.Select(ToModel).ToList();
            }
        }

        private static string GetInsertTagQuery() {
            return $"INSERT OR IGNORE INTO {Tables.Tags} (tag, date_created) VALUES(:Tag, :DateCreated)";
        }

        private static string GetSelectTagsQuery() {
            return $"SELECT id, name FROM { Tables.Tags }";
        }

        private static Tag ToModel(TagEntity entity) {
            return new Tag { Name = entity.Name };
        }
    }
}
