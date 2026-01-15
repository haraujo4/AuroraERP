using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Aurora.Application.Interfaces.Finance;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;

namespace Aurora.API.Controllers.Finance
{
    [ApiController]
    [Route("api/finance/clearing")]
    // [Authorize(AuthenticationSchemes = Microsoft.AspNetCore.Authentication.JwtBearer.JwtBearerDefaults.AuthenticationScheme)]
    public class ClearingController : ControllerBase
    {
        private readonly IClearingService _clearingService;

        public ClearingController(IClearingService clearingService)
        {
            _clearingService = clearingService;
        }

        [HttpGet("open-items/{partnerId}")]
        public async Task<ActionResult<List<OpenItemDto>>> GetOpenItems(Guid partnerId)
        {
            try
            {
                var items = await _clearingService.GetOpenItemsAsync(partnerId);
                return Ok(items);
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        [HttpPost("clear")]
        public async Task<IActionResult> ClearManual([FromBody] ManualClearingRequest request)
        {
            try
            {
                await _clearingService.ClearManualAsync(request);
                return Ok(new { message = "Compensation completed successfully" });
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }
    }
}
