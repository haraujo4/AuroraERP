using System;
using System.Security.Claims;
using System.Threading.Tasks;
using Aurora.Application.Interfaces.Security;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Aurora.API.Controllers.Security
{
    [ApiController]
    [Route("api/users")]
    [Authorize]
    public class UserController : ControllerBase
    {
        private readonly IUserService _userService;

        public UserController(IUserService userService)
        {
            _userService = userService;
        }

        private Guid GetCurrentUserId()
        {
            var idClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value; // Or "sub" depending on mapping
            if (idClaim == null) idClaim = User.FindFirst("sub")?.Value;
            
            if (Guid.TryParse(idClaim, out var id))
                return id;
            
            throw new UnauthorizedAccessException("Usuário não identificado.");
        }

        [HttpGet("me")]
        public async Task<IActionResult> GetMyProfile()
        {
            var userId = GetCurrentUserId();
            var user = await _userService.GetByIdAsync(userId);
            if (user == null) return NotFound();
            return Ok(user);
        }

        [HttpPost("me/password")]
        public async Task<IActionResult> ChangeMyPassword([FromBody] ChangePasswordDto request)
        {
            var userId = GetCurrentUserId();
            var success = await _userService.ChangePasswordAsync(userId, request);
            if (!success) return BadRequest(new { message = "Erro ao alterar senha. Verifique a senha atual." });
            return Ok(new { message = "Senha alterada com sucesso." });
        }

        [HttpGet]
        [Authorize(Roles = "Admin,ADMIN")]
        public async Task<IActionResult> GetAllUsers()
        {
            var users = await _userService.GetAllAsync();
            return Ok(users);
        }

        [HttpPost]
        [Authorize(Roles = "Admin,ADMIN")]
        public async Task<IActionResult> CreateUser([FromBody] CreateUserDto request)
        {
            var user = await _userService.CreateAsync(request);
            return CreatedAtAction(nameof(GetMyProfile), new { }, user);
        }

        [HttpPut("{id}")]
        [Authorize(Roles = "Admin,ADMIN")]
        public async Task<IActionResult> UpdateUser(Guid id, [FromBody] UpdateUserDto request)
        {
            var user = await _userService.UpdateAsync(id, request);
            if (user == null) return NotFound();
            return Ok(user);
        }

        [HttpDelete("{id}")]
        [Authorize(Roles = "Admin,ADMIN")]
        public async Task<IActionResult> DeleteUser(Guid id)
        {
            var success = await _userService.DeleteAsync(id);
            if (!success) return NotFound();
            return Ok(new { message = "Usuário removido com sucesso." });
        }
    }
}
