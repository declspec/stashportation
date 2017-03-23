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

            var stashId = await _stashService.Create(model);
            return Response.Created(stashId);
        }
    }
}
