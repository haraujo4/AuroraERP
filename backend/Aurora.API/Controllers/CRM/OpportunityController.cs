using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Aurora.Application.DTOs.CRM;
using Aurora.Application.Interfaces.CRM;
using Microsoft.AspNetCore.Mvc;

namespace Aurora.API.Controllers.CRM
{
    [ApiController]
    [Route("api/crm/opportunities")]
    public class OpportunityController : ControllerBase
    {
        private readonly IOpportunityService _service;

        public OpportunityController(IOpportunityService service)
        {
            _service = service;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<OpportunityDto>>> GetAll()
        {
            var result = await _service.GetAllAsync();
            return Ok(result);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<OpportunityDto>> GetById(Guid id)
        {
            var result = await _service.GetByIdAsync(id);
            if (result == null) return NotFound();
            return Ok(result);
        }

        [HttpPost]
        public async Task<ActionResult<OpportunityDto>> Create(CreateOpportunityDto dto)
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

         public class UpdateStageRequest {
            public string Stage { get; set; }
            public int Probability { get; set; }
        }

        [HttpPatch("{id}/stage")]
        public async Task<IActionResult> UpdateStage(Guid id, [FromBody] UpdateStageRequest request)
        {
            try
            {
                await _service.UpdateStageAsync(id, request.Stage, request.Probability);
                return NoContent();
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }
    }
}
