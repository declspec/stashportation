﻿using Microsoft.AspNetCore.Mvc;
using Stashportation.Database.Repositories;
using Stashportation.Filters;
using Stashportation.Utils;
using System.Linq;
using System.Threading.Tasks;

namespace Stashportation.Controllers {
    [Route("api/tags")]
    [ServiceFilter(typeof(ApiExceptionFilter))]
    public class TagController : ControllerBase {
        private readonly ITagRepository _tagRepository;

        public TagController(ITagRepository tagRepository) {
            _tagRepository = tagRepository;
        }

        [HttpGet("")]
        public async Task<IActionResult> FindAll() {
            var tags = await _tagRepository.FindAll();
            return Response.Ok(tags.Select(t => t.Name));
        }
    }
}
