using System;
using Aurora.Domain.Common;

namespace Aurora.Domain.Entities.Production
{
    public class WorkCenter : BaseEntity
    {
        public string Name { get; private set; }
        public string Code { get; private set; }
        public bool IsActive { get; private set; }
        
        // Link to Finance (Cost Center) - Optional for MVP
        public Guid? CostCenterId { get; private set; }

        public WorkCenter(string name, string code, Guid? costCenterId = null)
        {
            Name = name;
            Code = code;
            CostCenterId = costCenterId;
            IsActive = true;
        }

        public void Update(string name, string code, Guid? costCenterId)
        {
            Name = name;
            Code = code;
            CostCenterId = costCenterId;
        }

        public void Deactivate()
        {
            IsActive = false;
        }

        // EF Core
        private WorkCenter() { }
    }
}
