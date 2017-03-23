using Stashportation.Database.Repositories;
using Stashportation.Models;
using System.Threading.Tasks;

namespace Stashportation.Services {
    public interface IStashService {
        Task<long> Create(Stash stash);
    }

    public class StashService : IStashService {
        private readonly IStashRepository _stashRepository;
        private readonly ITagRepository _tagRepository;

        public StashService(IStashRepository stashRepository, ITagRepository tagRepository) {
            _stashRepository = stashRepository;
            _tagRepository = tagRepository;
        }

        public async Task<long> Create(Stash stash) {
            if (stash.Tags != null && stash.Tags.Count > 0)
                await _tagRepository.CreateAll(stash.Tags);

            return await _stashRepository.Create(stash);
        }
    }
}
