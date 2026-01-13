using System;
using System.Threading.Tasks;
using Aurora.Application.DTOs.Purchasing;
using Aurora.Application.Interfaces.Purchasing;
using Microsoft.AspNetCore.Mvc;

namespace Aurora.API.Controllers.Purchasing
{
    [ApiController]
    [Route("api/purchasing/requisitions")]
    public class PurchaseRequisitionController : ControllerBase
    {
        private readonly IPurchasingService _purchasingService;

        public PurchaseRequisitionController(IPurchasingService purchasingService)
        {
            _purchasingService = purchasingService;
        }

        [HttpPost]
        public async Task<IActionResult> CreateRequisition([FromBody] CreatePurchaseRequisitionDto dto)
        {
            var requisition = await _purchasingService.CreateRequisitionAsync(dto);
            return CreatedAtAction(nameof(GetRequisition), new { id = requisition.Id }, requisition);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetRequisition(Guid id)
        {
            var requisition = await _purchasingService.GetRequisitionByIdAsync(id);
            if (requisition == null) return NotFound();
            return Ok(requisition);
        }

        [HttpGet]
        public async Task<IActionResult> GetRequisitions()
        {
            var requisitions = await _purchasingService.GetAllRequisitionsAsync();
            return Ok(requisitions);
        }

        [HttpPost("{id}/approve")]
        public async Task<IActionResult> ApproveRequisition(Guid id)
        {
            try
            {
                await _purchasingService.ApproveRequisitionAsync(id);
                return Ok();
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }
    }
}
