using System;
using Aurora.Domain.Common;

namespace Aurora.Domain.Entities.Security
{
    public class Permission : BaseEntity
    {
        public string Code { get; private set; } // e.g. "LO_PO_APPROVE"
        public string Name { get; private set; } // e.g. "Approve Purchase Order"
        public string Module { get; private set; } // e.g. "Logistics"
        public string Transaction { get; private set; } // e.g. "ME21N"
        public string Description { get; private set; }

        // EF Core Constructor
        private Permission() { }

        public Permission(string code, string name, string module, string transaction, string description)
        {
            Code = code;
            Name = name;
            Module = module;
            Transaction = transaction;
            Description = description;
        }
    }
}
