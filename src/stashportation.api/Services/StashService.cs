using Stashportation.Database.Repositories;
using Stashportation.Models;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Stashportation.Services {
    public interface IStashService {
        Task Create(Stash stash);
        Task Update(Stash stash);
        Task<Stash> FindById(long id);
        Task<IList<StashSummary>> FindSummariesByTag(string tag);
        Task<IList<StashSummary>> FindSummariesByQuery(string query);
    }

    public class StashService : IStashService {
        private readonly IStashRepository _stashRepository;
        private readonly ITagRepository _tagRepository;

        public StashService(IStashRepository stashRepository, ITagRepository tagRepository) {
            _stashRepository = stashRepository;
            _tagRepository = tagRepository;
        }

        public async Task Create(Stash stash) {
            await EnsureTagsExist(stash);
            await _stashRepository.Create(stash);
        }

        public async Task Update(Stash stash) {
            await EnsureTagsExist(stash);
            await _stashRepository.Update(stash);
        }

        public Task<Stash> FindById(long id)
            => _stashRepository.FindById(id);

        public Task<IList<StashSummary>> FindSummariesByTag(string tag)
            => _stashRepository.FindSummariesByTag(tag.ToLower());

        public Task<IList<StashSummary>> FindSummariesByQuery(string query)
            => _stashRepository.FindSummariesByQuery(query);

        private Task EnsureTagsExist(Stash stash) {
            if (stash.Tags == null || stash.Tags.Count == 0)
                return Task.CompletedTask;

            stash.Tags = stash.Tags
                .Where(t => !string.IsNullOrWhiteSpace(t))
                .Select(t => t.ToLower())
                .Distinct()
                .ToList();

            return _tagRepository.CreateAll(stash.Tags);
        }
    }
}
