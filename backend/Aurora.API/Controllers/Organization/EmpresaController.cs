using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Aurora.Application.DTOs.Organization;
using Aurora.Application.Interfaces.Organization;
using Microsoft.AspNetCore.Mvc;

namespace Aurora.API.Controllers.Organization
{
    [ApiController]
    [Route("api/organization/companies")]
    public class EmpresaController : ControllerBase
    {
        private readonly IEmpresaService _service;

        public EmpresaController(IEmpresaService service)
        {
            _service = service;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<EmpresaDto>>> GetAll()
        {
            var result = await _service.GetAllAsync();
            return Ok(result);
        }

        [HttpGet("by-group/{grupoId}")]
        public async Task<ActionResult<IEnumerable<EmpresaDto>>> GetByGroup(Guid grupoId)
        {
            var result = await _service.GetByGrupoAsync(grupoId);
            return Ok(result);
        }

        [HttpPost]
        public async Task<ActionResult<EmpresaDto>> Create(CreateEmpresaDto dto)
        {
            var result = await _service.CreateAsync(dto);
            return CreatedAtAction(nameof(GetByGroup), new { grupoId = result.GrupoEmpresarialId }, result);
        }

        [HttpPut("{id}")]
        public async Task<ActionResult<EmpresaDto>> Update(Guid id, [FromBody] UpdateEmpresaDto dto)
        {
            var result = await _service.UpdateAsync(id, dto);
            if (result == null) return NotFound();
            return Ok(result);
        }
    }
}
