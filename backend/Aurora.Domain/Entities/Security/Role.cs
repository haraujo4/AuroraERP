using System;
using System.Collections.Generic;
using Aurora.Domain.Common;

namespace Aurora.Domain.Entities.Security
{
    public class Role : BaseEntity
    {
        public string Name { get; private set; }
        public string Description { get; private set; }
        
        private readonly List<Permission> _permissions = new();
        public IReadOnlyCollection<Permission> Permissions => _permissions.AsReadOnly();

        public Role(string name, string description)
        {
            Name = name.ToUpper();
            Description = description;
        }

        // EF Core Constructor
        private Role() { }

        public void SetPermissions(List<Permission> permissions)
        {
            _permissions.Clear();
            _permissions.AddRange(permissions);
        }
    }
}
