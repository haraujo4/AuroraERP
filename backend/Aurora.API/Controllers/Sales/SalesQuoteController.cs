using Aurora.Application.DTOs.Sales;
using Aurora.Application.Interfaces.Sales;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Threading.Tasks;

namespace Aurora.API.Controllers.Sales
{
    [ApiController]
    [Route("api/sales/quotes")]
    public class SalesQuoteController : ControllerBase
    {
        private readonly ISalesQuoteService _service;

        public SalesQuoteController(ISalesQuoteService service)
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
        public async Task<IActionResult> Create(CreateSalesQuoteDto dto)
        {
            var result = await _service.CreateAsync(dto);
            return CreatedAtAction(nameof(GetById), new { id = result.Id }, result);
        }

        [HttpPatch("{id}/status")]
        public async Task<IActionResult> UpdateStatus(Guid id, [FromBody] UpdateSalesQuoteStatusDto dto)
        {
            try
            {
                await _service.UpdateStatusAsync(id, dto.Status);
                return NoContent();
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }
    }
}
