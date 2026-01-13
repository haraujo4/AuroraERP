using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Aurora.Application.DTOs.Organization;
using Aurora.Application.Interfaces.Organization;
using Microsoft.AspNetCore.Mvc;

namespace Aurora.API.Controllers.Organization
{
    [ApiController]
    [Route("api/organization/storage-locations")]
    public class LocalEstoqueController : ControllerBase
    {
        private readonly ILocalEstoqueService _service;

        public LocalEstoqueController(ILocalEstoqueService service)
        {
            _service = service;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<LocalEstoqueDto>>> GetAll()
        {
            var result = await _service.GetAllAsync();
            return Ok(result);
        }

        [HttpGet("by-warehouse/{warehouseId}")]
        public async Task<ActionResult<IEnumerable<LocalEstoqueDto>>> GetByWarehouse(Guid warehouseId)
        {
            var result = await _service.GetByDepositoAsync(warehouseId);
            return Ok(result);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<LocalEstoqueDto>> GetById(Guid id)
        {
            var result = await _service.GetByIdAsync(id);
            if (result == null) return NotFound();
            return Ok(result);
        }

        [HttpPost]
        public async Task<ActionResult<LocalEstoqueDto>> Create(CreateLocalEstoqueDto dto)
        {
            var result = await _service.CreateAsync(dto);
            return CreatedAtAction(nameof(GetById), new { id = result.Id }, result);
        }

        [HttpPut("{id}")]
        public async Task<ActionResult<LocalEstoqueDto>> Update(Guid id, [FromBody] UpdateLocalEstoqueDto dto)
        {
            var result = await _service.UpdateAsync(id, dto);
            if (result == null) return NotFound();
            return Ok(result);
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(Guid id)
        {
            await _service.DeleteAsync(id);
            return NoContent();
        }
    }
}
