using Aurora.Application.Interfaces.Security;
using Aurora.Application.Interfaces.Repositories;
using Aurora.Application.Interfaces.Events;
using Aurora.Domain.Entities.Security;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using System.Linq;

namespace Aurora.Application.Services.Security
{
    public class UserService : IUserService
    {
        private readonly IRepository<User> _userRepo;
        private readonly IRepository<Role> _roleRepo;
        private readonly IRepository<Permission> _permissionRepo;
        private readonly IEventBus _eventBus;

        public UserService(IRepository<User> userRepo, IRepository<Role> roleRepo, IRepository<Permission> permissionRepo, IEventBus eventBus)
        {
            _userRepo = userRepo;
            _roleRepo = roleRepo;
            _permissionRepo = permissionRepo;
            _eventBus = eventBus;
        }

        public async Task<UserDto> CreateAsync(CreateUserDto request)
        {
            var passwordHash = BCrypt.Net.BCrypt.HashPassword(request.Password);
            var user = new User(request.Username, request.Email, passwordHash);
            
            if (request.EmpresaId.HasValue)
                user.SetContext(request.EmpresaId.Value, request.FilialId);

            if (request.Roles.Any())
            {
                var roles = await _roleRepo.FindAsync(r => request.Roles.Contains(r.Name));
                foreach (var role in roles)
                {
                    user.AddRole(role);
                }
            }

            // Handle Permissions
            if (request.Permissions.Any())
            {
                var allPermissions = await _permissionRepo.FindAsync(p => request.Permissions.Contains(p.Code));
                foreach (var perm in allPermissions)
                {
                    user.AddPermission(perm);
                }
            }

            await _userRepo.AddAsync(user);

            // Publish Event (using the correct namespace if needed)
            await _eventBus.PublishAsync(new Aurora.Application.Events.Identity.UserCreatedEvent(user.Username, user.Email));

            return MapToDto(user);
        }

        public async Task<UserDto?> UpdateAsync(Guid id, UpdateUserDto request)
        {
            var users = await _userRepo.GetAllAsync(u => u.Roles, u => u.Permissions, u => u.Empresa, u => u.Filial);
            var user = users.FirstOrDefault(u => u.Id == id);
            if (user == null) return null;

            user.UpdateDetails(request.Email, request.IsActive);

            if (request.EmpresaId.HasValue)
                user.SetContext(request.EmpresaId.Value, request.FilialId);
            else
                user.ClearContext();

            // Update Roles
            // Update Roles
            var roles = await _roleRepo.FindAsync(r => request.Roles.Contains(r.Name));
            
            // Temporary Debug Logging
            Console.WriteLine($"UpdateUser: Requested Roles: {string.Join(", ", request.Roles)}");
            Console.WriteLine($"UpdateUser: Found Roles: {string.Join(", ", roles.Select(r => r.Name))}");
            
            user.SetRoles(roles.ToList());

            // Update Permissions
            if (request.Permissions.Any())
            {
                var allPermissions = await _permissionRepo.FindAsync(p => request.Permissions.Contains(p.Code));
                user.SetPermissions(allPermissions.ToList());
            }
            else
            {
                user.SetPermissions(new List<Permission>());
            }

            await _userRepo.UpdateAsync(user);
            return MapToDto(user);
        }

        public async Task<bool> ChangePasswordAsync(Guid id, ChangePasswordDto request)
        {
            var users = await _userRepo.GetAllAsync();
            var user = users.FirstOrDefault(u => u.Id == id);
            if (user == null) return false;

            if (!string.IsNullOrEmpty(request.CurrentPassword))
            {
                if (!BCrypt.Net.BCrypt.Verify(request.CurrentPassword, user.PasswordHash))
                {
                    return false;
                }
            }

            var newHash = BCrypt.Net.BCrypt.HashPassword(request.NewPassword);
            user.ChangePassword(newHash);
            await _userRepo.UpdateAsync(user);
            return true;
        }

        public async Task<bool> DeleteAsync(Guid id)
        {
            var users = await _userRepo.GetAllAsync();
            var user = users.FirstOrDefault(u => u.Id == id);
            if (user == null) return false;

            await _userRepo.DeleteAsync(id);
            return true;
        }

        public async Task<List<UserDto>> GetAllAsync()
        {
            var users = await _userRepo.GetAllAsync(u => u.Roles, u => u.Permissions, u => u.Empresa, u => u.Filial);
            return users.Select(MapToDto).ToList();
        }

        public async Task<UserDto?> GetByIdAsync(Guid id)
        {
            var user = await _userRepo.GetByIdAsync(id, u => u.Roles, u => u.Permissions, u => u.Empresa, u => u.Filial);
            return user == null ? null : MapToDto(user);
        }

        public async Task<UserDto?> GetByUsernameAsync(string username)
        {
            var users = await _userRepo.FindAsync(u => u.Username == username, u => u.Roles, u => u.Permissions);
            var user = users.FirstOrDefault();
            return user == null ? null : MapToDto(user);
        }

        private static UserDto MapToDto(User user)
        {
            return new UserDto
            {
                Id = user.Id,
                Username = user.Username,
                Email = user.Email,
                Roles = user.Roles.Select(r => r.Name).ToList(),
                Permissions = user.Permissions.Select(p => p.Code).ToList(),
                IsActive = user.IsActive,
                LastLogin = user.LastLogin,
                EmpresaId = user.EmpresaId,
                EmpresaName = user.Empresa?.NomeFantasia,
                FilialId = user.FilialId,
                FilialName = user.Filial?.Descricao
            };
        }
    }
}
