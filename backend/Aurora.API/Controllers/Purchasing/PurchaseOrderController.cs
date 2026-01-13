using System;
using System.Threading.Tasks;
using Aurora.Application.DTOs.Purchasing;
using Aurora.Application.Interfaces.Purchasing;
using Microsoft.AspNetCore.Mvc;

namespace Aurora.API.Controllers.Purchasing
{
    [ApiController]
    [Route("api/purchasing/orders")]
    public class PurchaseOrderController : ControllerBase
    {
        private readonly IPurchasingService _purchasingService;

        public PurchaseOrderController(IPurchasingService purchasingService)
        {
            _purchasingService = purchasingService;
        }

        [HttpPost]
        public async Task<IActionResult> CreateOrder([FromBody] CreatePurchaseOrderDto dto)
        {
            var order = await _purchasingService.CreateOrderAsync(dto);
            return CreatedAtAction(nameof(GetOrder), new { id = order.Id }, order);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetOrder(Guid id)
        {
            var order = await _purchasingService.GetOrderByIdAsync(id);
            if (order == null) return NotFound();
            return Ok(order);
        }

        [HttpGet]
        public async Task<IActionResult> GetOrders()
        {
            var orders = await _purchasingService.GetAllOrdersAsync();
            return Ok(orders);
        }

        [HttpPost("{id}/approve")]
        public async Task<IActionResult> ApproveOrder(Guid id)
        {
            try
            {
                await _purchasingService.ApproveOrderAsync(id);
                return Ok();
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpPost("{id}/receive")]
        public async Task<IActionResult> ReceiveOrder(Guid id)
        {
             try
            {
                await _purchasingService.ReceiveOrderAsync(id);
                return Ok();
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }
    }
}
