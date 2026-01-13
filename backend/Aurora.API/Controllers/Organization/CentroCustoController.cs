using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Aurora.Application.DTOs.Organization;
using Aurora.Application.Interfaces.Organization;
using Microsoft.AspNetCore.Mvc;

namespace Aurora.API.Controllers.Organization
{
    [ApiController]
    [Route("api/organization/cost-centers")]
    public class CentroCustoController : ControllerBase
    {
        private readonly ICentroCustoService _service;

        public CentroCustoController(ICentroCustoService service)
        {
            _service = service;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<CentroCustoDto>>> GetAll()
        {
            var result = await _service.GetAllAsync();
            return Ok(result);
        }

        [HttpGet("by-company/{companyId}")]
        public async Task<ActionResult<IEnumerable<CentroCustoDto>>> GetByCompany(Guid companyId)
        {
            var result = await _service.GetByEmpresaAsync(companyId);
            return Ok(result);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<CentroCustoDto>> GetById(Guid id)
        {
            var result = await _service.GetByIdAsync(id);
            if (result == null) return NotFound();
            return Ok(result);
        }

        [HttpPost]
        public async Task<ActionResult<CentroCustoDto>> Create(CreateCentroCustoDto dto)
        {
            var result = await _service.CreateAsync(dto);
            return CreatedAtAction(nameof(GetById), new { id = result.Id }, result);
        }

        [HttpPut("{id}")]
        public async Task<ActionResult<CentroCustoDto>> Update(Guid id, [FromBody] UpdateCentroCustoDto dto)
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
