using Aurora.Application.DTOs.Sales;
using Aurora.Application.Interfaces.Sales;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Threading.Tasks;

namespace Aurora.API.Controllers.Sales
{
    [ApiController]
    [Route("api/sales/orders")]
    public class SalesOrderController : ControllerBase
    {
        private readonly ISalesOrderService _service;

        public SalesOrderController(ISalesOrderService service)
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
        public async Task<IActionResult> Create(CreateSalesOrderDto dto)
        {
            var result = await _service.CreateAsync(dto);
            return CreatedAtAction(nameof(GetById), new { id = result.Id }, result);
        }

        [HttpPost("from-quote/{quoteId}")]
        public async Task<IActionResult> CreateFromQuote(Guid quoteId)
        {
            try
            {
                var result = await _service.CreateFromQuoteAsync(quoteId);
                return CreatedAtAction(nameof(GetById), new { id = result.Id }, result);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpPatch("{id}/status")]
        public async Task<IActionResult> UpdateStatus(Guid id, [FromBody] UpdateSalesOrderStatusDto dto)
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
