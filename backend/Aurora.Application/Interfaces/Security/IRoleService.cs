using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Aurora.Application.Interfaces.Security
{
    public interface IRoleService
    {
        Task<List<RoleDto>> GetAllAsync();
        Task<RoleDto?> GetByIdAsync(Guid id);
        Task<RoleDto> CreateAsync(CreateRoleDto request);
        Task<RoleDto?> UpdateAsync(Guid id, UpdateRoleDto request);
        Task DeleteAsync(Guid id);
        Task<List<PermissionDto>> GetAllPermissionsAsync();
    }

    public class RoleDto
    {
        public Guid Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public List<PermissionDto> Permissions { get; set; } = new();
    }

    // PermissionDto removed (Defined in IPermissionService or Shared)

    public class CreateRoleDto
    {
        public string Name { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public List<Guid> PermissionIds { get; set; } = new();
    }

    public class UpdateRoleDto
    {
        public string Description { get; set; } = string.Empty;
        public List<Guid> PermissionIds { get; set; } = new();
    }
}
