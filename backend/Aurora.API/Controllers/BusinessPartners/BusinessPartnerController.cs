using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Aurora.Application.DTOs.BusinessPartners;
using Aurora.Application.Interfaces.BusinessPartners;
using Microsoft.AspNetCore.Mvc;

namespace Aurora.API.Controllers.BusinessPartners
{
    [ApiController]
    [Route("api/crm/business-partners")] // Follows Doc 3 (CRM/Commercial) routing logic
    public class BusinessPartnerController : ControllerBase
    {
        private readonly IBusinessPartnerService _service;

        public BusinessPartnerController(IBusinessPartnerService service)
        {
            _service = service;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<BusinessPartnerDto>>> GetAll()
        {
            var result = await _service.GetAllAsync();
            return Ok(result);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<BusinessPartnerDto>> GetById(Guid id)
        {
            var result = await _service.GetByIdAsync(id);
            if (result == null) return NotFound();
            return Ok(result);
        }

        [HttpPost]
        public async Task<ActionResult<BusinessPartnerDto>> Create(CreateBusinessPartnerDto dto)
        {
            try 
            {
                var result = await _service.CreateAsync(dto);
                return CreatedAtAction(nameof(GetById), new { id = result.Id }, result);
            }
            catch (ArgumentException ex)
            {
                return BadRequest(ex.Message);
            }
        }
    }
}
