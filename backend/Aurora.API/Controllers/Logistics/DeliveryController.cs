using System;
using System.Threading.Tasks;
using Aurora.Application.Interfaces.Logistics;
using Microsoft.AspNetCore.Mvc;

namespace Aurora.API.Controllers.Logistics
{
    [ApiController]
    [Route("api/logistics/deliveries")]
    public class DeliveryController : ControllerBase
    {
        private readonly IDeliveryService _service;

        public DeliveryController(IDeliveryService service)
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

        [HttpPost("from-order/{orderId}")]
        public async Task<IActionResult> CreateFromOrder(Guid orderId)
        {
            try
            {
                var result = await _service.CreateFromOrderAsync(orderId);
                return CreatedAtAction(nameof(GetById), new { id = result.Id }, result);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpPost("{id}/post")]
        public async Task<IActionResult> PostDelivery(Guid id)
        {
            try
            {
                await _service.PostDeliveryAsync(id);
                return Ok();
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }
    }
}
