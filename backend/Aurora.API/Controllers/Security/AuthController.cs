using System.Threading.Tasks;
using Aurora.Application.Interfaces.Security;
using Microsoft.AspNetCore.Mvc;

namespace Aurora.API.Controllers.Security
{
    [ApiController]
    [Route("api/auth")]
    public class AuthController : ControllerBase
    {
        private readonly IAuthService _authService;

        public AuthController(IAuthService authService)
        {
            _authService = authService;
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginRequestDto request)
        {
            var response = await _authService.LoginAsync(request);
            if (response == null)
            {
                return Unauthorized(new { message = "Credenciais inválidas." });
            }
            return Ok(response);
        }

        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] RegisterRequestDto request)
        {
            var success = await _authService.RegisterAsync(request);
            if (!success)
            {
                return BadRequest(new { message = "Erro ao registrar usuário. Nome de usuário ou email já em uso." });
            }
            return Ok(new { message = "Usuário registrado com sucesso." });
        }
    }
}
