using System;
using System.Collections.Generic;
using Aurora.Domain.Common;

namespace Aurora.Domain.Entities.Security
{
    public class User : BaseEntity
    {
        public string Username { get; private set; }
        public string Email { get; private set; }
        public string PasswordHash { get; private set; }
        public bool IsActive { get; private set; }
        public DateTime? LastLogin { get; private set; }

        private readonly List<Role> _roles = new();
        public IReadOnlyCollection<Role> Roles => _roles.AsReadOnly();

        public User(string username, string email, string passwordHash)
        {
            Username = username;
            Email = email;
            PasswordHash = passwordHash;
            IsActive = true;
        }

        // EF Core Constructor
        private User() { }

        public void AddRole(Role role)
        {
            if (!_roles.Contains(role))
            {
                _roles.Add(role);
            }
        }

        public void UpdateLastLogin()
        {
            LastLogin = DateTime.UtcNow;
        }

        public void UpdateDetails(string email, bool isActive)
        {
            Email = email;
            IsActive = isActive;
        }

        public void ChangePassword(string newPasswordHash)
        {
            PasswordHash = newPasswordHash;
        }

        public void SetRoles(List<Role> roles)
        {
            _roles.Clear();
            _roles.AddRange(roles);
        }

        public void Deactivate()
        {
            IsActive = false;
        }
    }
}
