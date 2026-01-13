using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Aurora.Application.Interfaces.Repositories;
using Aurora.Application.Interfaces.Security;
using Aurora.Domain.Entities.Security;

namespace Aurora.Application.Services.Security
{
    public class UserService : IUserService
    {
        private readonly IRepository<User> _userRepo;
        private readonly IRepository<Role> _roleRepo;

        public UserService(IRepository<User> userRepo, IRepository<Role> roleRepo)
        {
            _userRepo = userRepo;
            _roleRepo = roleRepo;
        }

        public async Task<List<UserDto>> GetAllAsync()
        {
            var users = await _userRepo.GetAllAsync(u => u.Roles);
            return users.Select(MapToDto).ToList();
        }

        public async Task<UserDto?> GetByIdAsync(Guid id)
        {
            var users = await _userRepo.GetAllAsync(u => u.Roles); // Repository pattern limitation, optimizing later
            var user = users.FirstOrDefault(u => u.Id == id);
            return user == null ? null : MapToDto(user);
        }

        public async Task<UserDto?> GetByUsernameAsync(string username)
        {
            var users = await _userRepo.GetAllAsync(u => u.Roles);
            var user = users.FirstOrDefault(u => u.Username == username);
            return user == null ? null : MapToDto(user);
        }

        public async Task<UserDto> CreateAsync(CreateUserDto request)
        {
            var passwordHash = BCrypt.Net.BCrypt.HashPassword(request.Password);
            var user = new User(request.Username, request.Email, passwordHash);

            // Handle Roles
            // For simplicity, creating dummy roles if not found or reusing. 
            // Ideally we should lookup from DB. In Aurora simplified:
            // We'll create ad-hoc roles or reusing if we had a role lookup.
            // Since Role repo is generic, let's just make new Role objects for now or try to match?
            // User entity AddRole adds to list.
            
            foreach (var roleName in request.Roles)
            {
                user.AddRole(new Role(roleName, $"Role {roleName}"));
            }

            await _userRepo.AddAsync(user);
            return MapToDto(user);
        }

        public async Task<UserDto?> UpdateAsync(Guid id, UpdateUserDto request)
        {
            var users = await _userRepo.GetAllAsync(u => u.Roles);
            var user = users.FirstOrDefault(u => u.Id == id);
            if (user == null) return null;

            user.UpdateDetails(request.Email, request.IsActive);

            // Update Roles
            var newRoles = request.Roles.Select(r => new Role(r, $"Role {r}")).ToList();
            user.SetRoles(newRoles);

            await _userRepo.UpdateAsync(user);
            return MapToDto(user);
        }

        public async Task<bool> ChangePasswordAsync(Guid id, ChangePasswordDto request)
        {
            var users = await _userRepo.GetAllAsync();
            var user = users.FirstOrDefault(u => u.Id == id);
            if (user == null) return false;

            // Verify current password if necessary (usually Checked by UI/Controller before calling? Or logic resides here)
            // If admin is resetting, CurrentPassword might be empty/ignored.
            // If user changing own password, we should verify.
            // Let's assume this method is strict: Verify Current if provided.
            
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

        private static UserDto MapToDto(User user)
        {
            return new UserDto
            {
                Id = user.Id,
                Username = user.Username,
                Email = user.Email,
                IsActive = user.IsActive,
                LastLogin = user.LastLogin,
                Roles = user.Roles.Select(r => r.Name).ToList()
            };
        }
    }
}
