using Aurora.Domain.Common;

namespace Aurora.Domain.Entities.HR
{
    public class JobTitle : BaseEntity
    {
        public string Title { get; private set; }
        public string? Description { get; private set; }
        public decimal BaseSalary { get; private set; }
        public Guid DepartmentId { get; private set; }

        // Navigation
        public virtual Department Department { get; private set; }

        protected JobTitle() { }

        public JobTitle(string title, Guid departmentId, decimal baseSalary, string? description = null)
        {
            Title = title;
            DepartmentId = departmentId;
            BaseSalary = baseSalary;
            Description = description;
        }

        public void Update(string title, decimal baseSalary, string? description)
        {
            Title = title;
            BaseSalary = baseSalary;
            Description = description;
        }
    }
}
