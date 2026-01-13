using Aurora.Domain.Common;
using System.Collections.Generic;

namespace Aurora.Domain.Entities.HR
{
    public class Department : BaseEntity
    {
        public string Name { get; private set; }
        public string? Description { get; private set; }
        public Guid? ManagerId { get; private set; }
        
        // Navigation Property
        public virtual ICollection<Employee> Employees { get; private set; } = new List<Employee>();
        public virtual ICollection<JobTitle> JobTitles { get; private set; } = new List<JobTitle>();

        protected Department() { }

        public Department(string name, string? description = null, Guid? managerId = null)
        {
            Name = name;
            Description = description;
            ManagerId = managerId;
        }

        public void Update(string name, string? description, Guid? managerId)
        {
            Name = name;
            Description = description;
            ManagerId = managerId;
        }
    }
}
