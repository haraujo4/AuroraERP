using System.Threading.Tasks;
using Aurora.Application.Interfaces.Planning;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Aurora.API.Controllers.Planning
{
    [Authorize]
    [ApiController]
    [Route("api/[controller]")]
    public class MRPController : ControllerBase
    {
        private readonly IMRPService _mrpService;

        public MRPController(IMRPService mrpService)
        {
            _mrpService = mrpService;
        }

        [HttpPost("run")]
        public async Task<IActionResult> RunMRP()
        {
            var result = await _mrpService.RunMRPAsync();
            return Ok(result);
        }
    }
}
