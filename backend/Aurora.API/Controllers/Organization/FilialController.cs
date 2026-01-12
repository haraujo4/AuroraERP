using Aurora.Application.DTOs.Organization;
using Aurora.Application.Interfaces.Organization;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Threading.Tasks;

namespace Aurora.API.Controllers.Organization
{
    [ApiController]
    [Route("api/organization/branches")]
    public class FilialController : ControllerBase
    {
        private readonly IFilialService _service;

        public FilialController(IFilialService service)
        {
            _service = service;
        }

        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var result = await _service.GetAllAsync();
            return Ok(result);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(Guid id)
        {
            var result = await _service.GetByIdAsync(id);
            if (result == null) return NotFound();
            return Ok(result);
        }

        [HttpPost]
        public async Task<IActionResult> Create(CreateFilialDto dto)
        {
            var result = await _service.CreateAsync(dto);
            return CreatedAtAction(nameof(GetById), new { id = result.Id }, result);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Update(Guid id, CreateFilialDto dto)
        {
            await _service.UpdateAsync(id, dto);
            return NoContent();
        }

        [HttpGet("{id}/depositos")]
        public async Task<IActionResult> GetDepositos(Guid id)
        {
            var result = await _service.GetDepositosAsync(id);
            return Ok(result);
        }

        [HttpPost("{id}/depositos")]
        public async Task<IActionResult> CreateDeposito(Guid id, CreateDepositoDto dto)
        {
            if (id != dto.FilialId) return BadRequest("Filial ID mismatch");
            
            var result = await _service.AddDepositoAsync(dto);
            return CreatedAtAction(nameof(GetDepositos), new { id = result.FilialId }, result);
        }
    }
}
