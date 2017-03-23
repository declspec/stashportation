using Microsoft.AspNetCore.Mvc;
using Stashportation.Models;
using Stashportation.Services;
using Stashportation.Utils;
using System.Threading.Tasks;

namespace Stashportation.Controllers {
    [Route("api/stash")]
    public class StashController : ControllerBase {
        private readonly IStashService _stashService;

        public StashController(IStashService stashService) {
            _stashService = stashService;
        }

        [HttpPost("")]
        public async Task<IActionResult> Create([FromBody] Stash model) {
            if (!ModelState.IsValid)
                return Response.ValidationError(ModelState.GetAllErrors());

            await _stashService.Create(model);
            return Response.Created(model.Id);
        }

        [HttpPut("{id:long}")]
        public async Task<IActionResult> Update(long id, [FromBody] Stash model) {
            if (model.Id != id)
                return Response.BadRequest("Invalid request");

            await _stashService.Update(model);
            return Response.Ok(null);
        }

        [HttpGet("{id:long}")]
        public async Task<IActionResult> FindById(long id) {
            var stash = await _stashService.FindById(id);
            return stash != null ? Response.Ok(stash) : Response.NotFound("No stash with the provided ID found");
        }

        [HttpGet("tags/{tag}")]
        public async Task<IActionResult> FindSummariesByTag(string tag) {
            var stashes = await _stashService.FindSummariesByTag(tag);
            return Response.Ok(stashes);
        }
    }
}
