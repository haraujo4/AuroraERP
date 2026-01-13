using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Aurora.Application.DTOs.Organization;
using Aurora.Application.Interfaces.Organization;
using Microsoft.AspNetCore.Mvc;

namespace Aurora.API.Controllers.Organization
{
    [ApiController]
    [Route("api/organization/profit-centers")]
    public class CentroLucroController : ControllerBase
    {
        private readonly ICentroLucroService _service;

        public CentroLucroController(ICentroLucroService service)
        {
            _service = service;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<CentroLucroDto>>> GetAll()
        {
            var result = await _service.GetAllAsync();
            return Ok(result);
        }

        [HttpGet("by-company/{companyId}")]
        public async Task<ActionResult<IEnumerable<CentroLucroDto>>> GetByCompany(Guid companyId)
        {
            var result = await _service.GetByEmpresaAsync(companyId);
            return Ok(result);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<CentroLucroDto>> GetById(Guid id)
        {
            var result = await _service.GetByIdAsync(id);
            if (result == null) return NotFound();
            return Ok(result);
        }

        [HttpPost]
        public async Task<ActionResult<CentroLucroDto>> Create(CreateCentroLucroDto dto)
        {
            var result = await _service.CreateAsync(dto);
            return CreatedAtAction(nameof(GetById), new { id = result.Id }, result);
        }

        [HttpPut("{id}")]
        public async Task<ActionResult<CentroLucroDto>> Update(Guid id, [FromBody] UpdateCentroLucroDto dto)
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
