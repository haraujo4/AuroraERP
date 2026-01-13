using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Aurora.Application.Interfaces.Production;
using Microsoft.AspNetCore.Mvc;

namespace Aurora.API.Controllers.Production
{
    [ApiController]
    [Route("api/production/boms")]
    public class BillOfMaterialController : ControllerBase
    {
        private readonly IProductionService _service;

        public BillOfMaterialController(IProductionService service)
        {
            _service = service;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<BillOfMaterialDto>>> GetAll()
        {
            return Ok(await _service.GetBOMsAsync());
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<BillOfMaterialDto>> GetById(Guid id)
        {
            var item = await _service.GetBOMByIdAsync(id);
            if (item == null) return NotFound();
            return Ok(item);
        }

        [HttpPost]
        public async Task<ActionResult<BillOfMaterialDto>> Create(CreateBillOfMaterialDto dto)
        {
            var created = await _service.CreateBOMAsync(dto);
            return CreatedAtAction(nameof(GetById), new { id = created.Id }, created);
        }
    }
}
