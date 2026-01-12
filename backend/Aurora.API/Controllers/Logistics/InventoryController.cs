using Aurora.Application.DTOs.Logistics;
using Aurora.Application.Interfaces.Logistics;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Threading.Tasks;

namespace Aurora.API.Controllers.Logistics
{
    [ApiController]
    [Route("api/logistics/inventory")]
    public class InventoryController : ControllerBase
    {
        private readonly IInventoryService _service;

        public InventoryController(IInventoryService service)
        {
            _service = service;
        }

        [HttpGet("stock/{materialId}/{depositoId}")]
        public async Task<IActionResult> GetStockLevel(Guid materialId, Guid depositoId, [FromQuery] string? batchNumber = null)
        {
            var quantity = await _service.GetStockLevelAsync(materialId, depositoId, batchNumber);
            return Ok(new { quantity });
        }

        [HttpGet("material/{materialId}")]
        public async Task<IActionResult> GetStockByMaterial(Guid materialId)
        {
            var result = await _service.GetStockByMaterialAsync(materialId);
            return Ok(result);
        }

        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var result = await _service.GetAllStocksAsync();
            return Ok(result);
        }

        [HttpPost("movement")]
        public async Task<IActionResult> CreateMovement(CreateStockMovementDto dto)
        {
            try
            {
                await _service.AddStockMovementAsync(dto);
                return Ok();
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }
    }
}
