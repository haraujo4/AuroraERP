using System;
using System.Threading.Tasks;
using Aurora.Application.Interfaces.Analytics;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Aurora.API.Controllers.Analytics
{
    [Authorize]
    [ApiController]
    [Route("api/[controller]")]
    public class ControladoriaController : ControllerBase
    {
        private readonly IControladoriaService _controladoriaService;

        public ControladoriaController(IControladoriaService controladoriaService)
        {
            _controladoriaService = controladoriaService;
        }

        [HttpGet("dre")]
        public async Task<IActionResult> GetDre([FromQuery] DateTime startDate, [FromQuery] DateTime endDate, [FromQuery] Guid? costCenterId, [FromQuery] Guid? profitCenterId)
        {
            var result = await _controladoriaService.GetDreAsync(startDate, endDate, costCenterId, profitCenterId);
            return Ok(result);
        }

        [HttpGet("performance/cost-center")]
        public async Task<IActionResult> GetCostCenterPerformance([FromQuery] DateTime startDate, [FromQuery] DateTime endDate)
        {
            var result = await _controladoriaService.GetCostCenterPerformanceAsync(startDate, endDate);
            return Ok(result);
        }

        [HttpGet("performance/profit-center")]
        public async Task<IActionResult> GetProfitCenterPerformance([FromQuery] DateTime startDate, [FromQuery] DateTime endDate)
        {
            var result = await _controladoriaService.GetProfitCenterPerformanceAsync(startDate, endDate);
            return Ok(result);
        }
    }
}
