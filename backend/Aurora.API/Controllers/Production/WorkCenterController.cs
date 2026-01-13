using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Aurora.Application.Interfaces.Production;
using Microsoft.AspNetCore.Mvc;

namespace Aurora.API.Controllers.Production
{
    [ApiController]
    [Route("api/production/work-centers")]
    public class WorkCenterController : ControllerBase
    {
        private readonly IProductionService _service;

        public WorkCenterController(IProductionService service)
        {
            _service = service;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<WorkCenterDto>>> GetAll()
        {
            return Ok(await _service.GetWorkCentersAsync());
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<WorkCenterDto>> GetById(Guid id)
        {
            var item = await _service.GetWorkCenterByIdAsync(id);
            if (item == null) return NotFound();
            return Ok(item);
        }

        [HttpPost]
        public async Task<ActionResult<WorkCenterDto>> Create(CreateWorkCenterDto dto)
        {
            var created = await _service.CreateWorkCenterAsync(dto);
            return CreatedAtAction(nameof(GetById), new { id = created.Id }, created);
        }
    }
}
