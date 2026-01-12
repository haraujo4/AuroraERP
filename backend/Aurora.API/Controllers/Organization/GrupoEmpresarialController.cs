using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Aurora.Application.DTOs.Organization;
using Aurora.Application.Interfaces.Organization;
using Microsoft.AspNetCore.Mvc;

namespace Aurora.API.Controllers.Organization
{
    [ApiController]
    [Route("api/organization/groups")]
    public class GrupoEmpresarialController : ControllerBase
    {
        private readonly IGrupoEmpresarialService _service;

        public GrupoEmpresarialController(IGrupoEmpresarialService service)
        {
            _service = service;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<GrupoEmpresarialDto>>> GetAll()
        {
            var result = await _service.GetAllAsync();
            return Ok(result);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<GrupoEmpresarialDto>> GetById(Guid id)
        {
            var result = await _service.GetByIdAsync(id);
            if (result == null) return NotFound();
            return Ok(result);
        }

        [HttpPost]
        public async Task<ActionResult<GrupoEmpresarialDto>> Create(CreateGrupoEmpresarialDto dto)
        {
            var result = await _service.CreateAsync(dto);
            return CreatedAtAction(nameof(GetById), new { id = result.Id }, result);
        }

        // [HttpPut("{id}")]...
    }
}
