using System;
using System.Collections.Generic;
using Aurora.Domain.Common;
using Aurora.Domain.Enums;

namespace Aurora.Domain.Entities.Finance
{
    public class Account : BaseEntity
    {
        public string Code { get; private set; }
        public string Name { get; private set; }
        public AccountType Type { get; private set; }
        public AccountNature Nature { get; private set; }
        public int Level { get; private set; }
        public bool IsActive { get; private set; }
        public Guid? ParentId { get; private set; }
        public Account? Parent { get; private set; }
        public ICollection<Account> Children { get; private set; } = new List<Account>();

        private Account() { }

        public Account(string code, string name, AccountType type, AccountNature nature, int level, Guid? parentId = null)
        {
            Code = code;
            Name = name;
            Type = type;
            Nature = nature;
            Level = level;
            ParentId = parentId;
            IsActive = true;
        }

        public void Update(string name, bool isActive)
        {
            Name = name;
            IsActive = isActive;
        }
    }
}
