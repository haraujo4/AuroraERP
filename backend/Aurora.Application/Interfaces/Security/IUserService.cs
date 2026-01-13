using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Aurora.Application.Interfaces.Security
{
    public interface IUserService
    {
        Task<List<UserDto>> GetAllAsync();
        Task<UserDto?> GetByIdAsync(Guid id);
        Task<UserDto?> GetByUsernameAsync(string username);
        Task<UserDto> CreateAsync(CreateUserDto request);
        Task<UserDto?> UpdateAsync(Guid id, UpdateUserDto request);
        Task<bool> ChangePasswordAsync(Guid id, ChangePasswordDto request);
        Task<bool> DeleteAsync(Guid id);
    }

    public class UserDto
    {
        public Guid Id { get; set; }
        public string Username { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public bool IsActive { get; set; }
        public DateTime? LastLogin { get; set; }
        public List<string> Roles { get; set; } = new();
    }

    public class CreateUserDto
    {
        public string Username { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string Password { get; set; } = string.Empty;
        public List<string> Roles { get; set; } = new();
    }

    public class UpdateUserDto
    {
        public string Email { get; set; } = string.Empty;
        public bool IsActive { get; set; }
        public List<string> Roles { get; set; } = new();
    }

    public class ChangePasswordDto
    {
        public string CurrentPassword { get; set; } = string.Empty;
        public string NewPassword { get; set; } = string.Empty;
    }
}
