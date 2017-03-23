using Microsoft.AspNetCore.Mvc;
using Stashportation.Database.Repositories;
using Stashportation.Utils;
using System.Threading.Tasks;

namespace Stashportation.Controllers {
    [Route("api/tag")]
    public class TagController : ControllerBase {
        private readonly ITagRepository _tagRepository;

        public TagController(ITagRepository tagRepository) {
            _tagRepository = tagRepository;
        }

        [HttpGet("")]
        public async Task<IActionResult> FindAll() {
            var tags = await _tagRepository.FindAll();
            return Response.Ok(tags);
        }
    }
}
