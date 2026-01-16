using System;
using System.Threading.Tasks;
using Aurora.Application.Interfaces.Security;
using Microsoft.AspNetCore.Authorization; // Assuming there is Auth
using Microsoft.AspNetCore.Mvc;

namespace Aurora.API.Controllers.Security
{
    [ApiController]
    [Route("api/security/roles")]
    public class RoleController : ControllerBase
    {
        private readonly IRoleService _roleService;

        public RoleController(IRoleService roleService)
        {
            _roleService = roleService;
        }

        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            return Ok(await _roleService.GetAllAsync());
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(Guid id)
        {
            var role = await _roleService.GetByIdAsync(id);
            if (role == null) return NotFound();
            return Ok(role);
        }

        [HttpPost]
        public async Task<IActionResult> Create(CreateRoleDto request)
        {
            try
            {
                var role = await _roleService.CreateAsync(request);
                return CreatedAtAction(nameof(GetById), new { id = role.Id }, role);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Update(Guid id, UpdateRoleDto request)
        {
            var role = await _roleService.UpdateAsync(id, request);
            if (role == null) return NotFound();
            return Ok(role);
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(Guid id)
        {
            await _roleService.DeleteAsync(id);
            return NoContent();
        }

        [HttpGet("permissions")]
        public async Task<IActionResult> GetAllPermissions()
        {
            return Ok(await _roleService.GetAllPermissionsAsync());
        }
    }
}
