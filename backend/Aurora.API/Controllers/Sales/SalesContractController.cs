using System;
using System.Threading.Tasks;
using Aurora.Application.DTOs.Sales;
using Aurora.Application.Interfaces.Sales;
using Microsoft.AspNetCore.Mvc;

namespace Aurora.API.Controllers.Sales
{
    [ApiController]
    [Route("api/sales/contracts")]
    public class SalesContractController : ControllerBase
    {
        private readonly ISalesContractService _contractService;

        public SalesContractController(ISalesContractService contractService)
        {
            _contractService = contractService;
        }

        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var result = await _contractService.GetAllAsync();
            return Ok(result);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(Guid id)
        {
            try
            {
                var result = await _contractService.GetByIdAsync(id);
                return Ok(result);
            }
            catch (Exception ex)
            {
                return NotFound(ex.Message);
            }
        }

        [HttpPost]
        public async Task<IActionResult> Create(CreateSalesContractDto dto)
        {
            try
            {
                var result = await _contractService.CreateAsync(dto);
                return CreatedAtAction(nameof(GetById), new { id = result.Id }, result);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Update(Guid id, UpdateSalesContractDto dto)
        {
            try
            {
                var result = await _contractService.UpdateAsync(id, dto);
                return Ok(result);
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
                var result = await _contractService.UpdateStatusAsync(id, status);
                return Ok(result);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(Guid id)
        {
            try
            {
                await _contractService.DeleteAsync(id);
                return NoContent();
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }
    }
}
