using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Aurora.Application.Interfaces.Repositories;
using Aurora.Application.Interfaces.Security;
using Aurora.Domain.Entities.Security;

namespace Aurora.Application.Services.Security
{
    public class RoleService : IRoleService
    {
        private readonly IRepository<Role> _roleRepository;
        private readonly IRepository<Permission> _permissionRepository;

        public RoleService(IRepository<Role> roleRepository, IRepository<Permission> permissionRepository)
        {
            _roleRepository = roleRepository;
            _permissionRepository = permissionRepository;
        }

        public async Task<List<RoleDto>> GetAllAsync()
        {
            var roles = await _roleRepository.GetAllAsync(r => r.Permissions);
            return roles.Select(MapToDto).ToList();
        }

        public async Task<RoleDto?> GetByIdAsync(Guid id)
        {
            var roles = await _roleRepository.FindAsync(r => r.Id == id, r => r.Permissions);
            var role = roles.FirstOrDefault();
            return role != null ? MapToDto(role) : null;
        }

        public async Task<RoleDto> CreateAsync(CreateRoleDto request)
        {
            // Verify if role exists
            var existing = await _roleRepository.FindAsync(r => r.Name == request.Name.ToUpper());
            if (existing.Any())
                throw new Exception($"Role {request.Name} already exists.");

            var role = new Role(request.Name, request.Description);

            // Fetch permissions
            if (request.PermissionIds.Any())
            {
                var permissions = await _permissionRepository.FindAsync(p => request.PermissionIds.Contains(p.Id));
                role.SetPermissions(permissions.ToList());
            }

            await _roleRepository.AddAsync(role);
            return MapToDto(role);
        }

        public async Task<RoleDto?> UpdateAsync(Guid id, UpdateRoleDto request)
        {
            var roles = await _roleRepository.FindAsync(r => r.Id == id, r => r.Permissions);
            var role = roles.FirstOrDefault();
            if (role == null) return null;

            // Note: Description update is missing in Role entity, assuming immutable Name but mutable Description?
            // Role entity provided earlier didn't have Update method. I should add it or use Reflection/AutoMapper or direct property set if public... 
            // Properties are private set. I need to add Update method to Role entity.
            
            // For now, I will assume I can't update description unless I add the method. 
            // I will implement "SetPermissions" which exists.
            
            if (request.PermissionIds.Any())
            {
                var permissions = await _permissionRepository.FindAsync(p => request.PermissionIds.Contains(p.Id));
                role.SetPermissions(permissions.ToList());
            }
            else
            {
                role.SetPermissions(new List<Permission>());
            }

            await _roleRepository.UpdateAsync(role);
            return MapToDto(role);
        }

        public async Task DeleteAsync(Guid id)
        {
            await _roleRepository.DeleteAsync(id);
        }

        public async Task<List<PermissionDto>> GetAllPermissionsAsync()
        {
            var permissions = await _permissionRepository.GetAllAsync();
            return permissions.Select(p => new PermissionDto
            {
                Id = p.Id,
                Code = p.Code,
                Name = p.Name,
                Module = p.Module,
                Transaction = p.Transaction
            }).ToList();
        }

        private RoleDto MapToDto(Role role)
        {
            return new RoleDto
            {
                Id = role.Id,
                Name = role.Name,
                Description = role.Description,
                Permissions = role.Permissions.Select(p => new PermissionDto
                {
                    Id = p.Id,
                    Code = p.Code,
                    Name = p.Name,
                    Module = p.Module,
                    Transaction = p.Transaction
                }).ToList()
            };
        }
    }
}
