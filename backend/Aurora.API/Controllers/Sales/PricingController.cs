using System;
using System.Threading.Tasks;
using Aurora.Application.Interfaces.Sales;
using Microsoft.AspNetCore.Mvc;

namespace Aurora.API.Controllers.Sales
{
    [ApiController]
    [Route("api/sales/pricing")]
    public class PricingController : ControllerBase
    {
        private readonly IPricingService _service;

        public PricingController(IPricingService service)
        {
            _service = service;
        }

        [HttpGet("calculate")]
        public async Task<IActionResult> Calculate([FromQuery] Guid materialId, [FromQuery] Guid businessPartnerId, [FromQuery] decimal quantity)
        {
            var result = await _service.CalculatePricingAsync(materialId, businessPartnerId, quantity);
            return Ok(result);
        }
    }
}
