using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Aurora.Application.DTOs.CRM;
using Aurora.Application.Interfaces.CRM;
using Microsoft.AspNetCore.Mvc;

namespace Aurora.API.Controllers.CRM
{
    [ApiController]
    [Route("api/crm/leads")]
    public class LeadController : ControllerBase
    {
        private readonly ILeadService _service;

        public LeadController(ILeadService service)
        {
            _service = service;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<LeadDto>>> GetAll()
        {
            var result = await _service.GetAllAsync();
            return Ok(result);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<LeadDto>> GetById(Guid id)
        {
            var result = await _service.GetByIdAsync(id);
            if (result == null) return NotFound();
            return Ok(result);
        }

        [HttpPost]
        public async Task<ActionResult<LeadDto>> Create(CreateLeadDto dto)
        {
            try
            {
                var result = await _service.CreateAsync(dto);
                return CreatedAtAction(nameof(GetById), new { id = result.Id }, result);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpPatch("{id}/status")]
        public async Task<IActionResult> UpdateStatus(Guid id, [FromBody] string status)
        {
            try
            {
                await _service.UpdateStatusAsync(id, status);
                return NoContent();
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }
    }
}
