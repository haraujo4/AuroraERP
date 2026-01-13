using System.Threading.Tasks;
using Aurora.Application.Interfaces.Analytics;
using Microsoft.AspNetCore.Mvc;

namespace Aurora.API.Controllers.Analytics
{
    [ApiController]
    [Route("api/analytics/dashboard")]
    public class DashboardController : ControllerBase
    {
        private readonly IDashboardService _dashboardService;

        public DashboardController(IDashboardService dashboardService)
        {
            _dashboardService = dashboardService;
        }

        [HttpGet]
        public async Task<IActionResult> GetOverview()
        {
            var result = await _dashboardService.GetFinancialOverviewAsync();
            return Ok(result);
        }
    }
}
