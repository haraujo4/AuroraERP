using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;
using Aurora.Application.Interfaces.Repositories;
using Aurora.Application.Interfaces.Security;
using Aurora.Domain.Entities.Security;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;

namespace Aurora.Application.Services.Security
{
    public class AuthService : IAuthService
    {
        private readonly IRepository<User> _userRepo;
        private readonly IRepository<Role> _roleRepo;
        private readonly IConfiguration _configuration;

        public AuthService(
            IRepository<User> userRepo,
            IRepository<Role> roleRepo,
            IConfiguration configuration)
        {
            _userRepo = userRepo;
            _roleRepo = roleRepo;
            _configuration = configuration;
        }

        public async Task<AuthResponseDto?> LoginAsync(LoginRequestDto request)
        {
            var users = await _userRepo.GetAllAsync(u => u.Roles, u => u.Permissions, u => u.Empresa!, u => u.Filial!);
            var user = users.FirstOrDefault(u => u.Email == request.Email);

            if (user == null || !BCrypt.Net.BCrypt.Verify(request.Password, user.PasswordHash))
            {
                return null;
            }

            user.UpdateLastLogin();
            await _userRepo.UpdateAsync(user);

            var token = GenerateJwtToken(user);

            return new AuthResponseDto
            {
                Token = token,
                Username = user.Username,
                Roles = user.Roles.Select(r => r.Name).ToList(),
                CompanyName = user.Empresa?.NomeFantasia,
                BranchName = user.Filial?.Descricao
            };
        }

        public async Task<bool> RegisterAsync(RegisterRequestDto request)
        {
            var sb = new StringBuilder();
            sb.AppendLine($"--- Login Attempt: {request.Email} at {DateTime.Now} ---");
            var users = await _userRepo.GetAllAsync();
            if (users.Any(u => u.Username == request.Username || u.Email == request.Email))
            {
                return false;
            }

            var passwordHash = BCrypt.Net.BCrypt.HashPassword(request.Password);
            var user = new User(request.Username, request.Email, passwordHash);

            foreach (var roleName in request.Roles)
            {
                var role = new Role(roleName, $"Default {roleName} role");
                user.AddRole(role);
            }

            await _userRepo.AddAsync(user);
            return true;
        }

        private string GenerateJwtToken(User user)
        {
            var jwtKey = _configuration["Jwt:Key"] ?? throw new InvalidOperationException("JWT Key not found in configuration.");
            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtKey));
            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

            var claims = new List<Claim>
            {
                new Claim(JwtRegisteredClaimNames.Sub, user.Id.ToString()),
                new Claim(JwtRegisteredClaimNames.UniqueName, user.Username),
                new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString()),
            };

            foreach (var role in user.Roles)
            {
                claims.Add(new Claim(ClaimTypes.Role, role.Name));
            }

            foreach (var perm in user.Permissions)
            {
                claims.Add(new Claim("Permission", perm.Code));
            }

            var token = new JwtSecurityToken(
                issuer: _configuration["Jwt:Issuer"],
                audience: _configuration["Jwt:Audience"],
                claims: claims,
                expires: DateTime.Now.AddMinutes(Convert.ToDouble(_configuration["Jwt:ExpireMinutes"] ?? "1440")),
                signingCredentials: creds
            );

            return new JwtSecurityTokenHandler().WriteToken(token);
        }
    }
}
