using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Aurora.Application.Interfaces.Production;
using Microsoft.AspNetCore.Mvc;

namespace Aurora.API.Controllers.Production
{
    [ApiController]
    [Route("api/production/orders")]
    public class ProductionOrderController : ControllerBase
    {
        private readonly IProductionService _service;

        public ProductionOrderController(IProductionService service)
        {
            _service = service;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<ProductionOrderDto>>> GetAll()
        {
            return Ok(await _service.GetOrdersAsync());
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<ProductionOrderDto>> GetById(Guid id)
        {
            var item = await _service.GetOrderByIdAsync(id);
            if (item == null) return NotFound();
            return Ok(item);
        }

        [HttpPost]
        public async Task<ActionResult<ProductionOrderDto>> Create(CreateProductionOrderDto dto)
        {
            var created = await _service.CreateOrderAsync(dto);
            return CreatedAtAction(nameof(GetById), new { id = created.Id }, created);
        }

        [HttpPost("{id}/release")]
        public async Task<IActionResult> Release(Guid id)
        {
            await _service.ReleaseOrderAsync(id);
            return NoContent();
        }

        [HttpPost("{id}/confirm")]
        public async Task<IActionResult> Confirm(Guid id)
        {
            try 
            {
                await _service.ConfirmOrderAsync(id);
                return NoContent();
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }
    }
}
