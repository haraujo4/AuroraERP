using System;
using System.Collections.Generic;
using Aurora.Domain.Common;

namespace Aurora.Domain.Entities.Security
{
    public class Role : BaseEntity
    {
        public string Name { get; private set; }
        public string Description { get; private set; }

        public Role(string name, string description)
        {
            Name = name.ToUpper();
            Description = description;
        }

        // EF Core Constructor
        private Role() { }
    }
}
