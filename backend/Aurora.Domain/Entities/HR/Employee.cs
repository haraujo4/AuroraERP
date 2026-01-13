using Aurora.Domain.Common;
using Aurora.Domain.ValueObjects;

namespace Aurora.Domain.Entities.HR
{
    public class Employee : BaseEntity
    {
        public string FullName { get; private set; }
        public string Email { get; private set; }
        public string Phone { get; private set; }
        public DateTime BirthDate { get; private set; }
        public DateTime HireDate { get; private set; }
        public decimal Salary { get; private set; }
        public bool IsActive { get; private set; } = true;

        public Guid JobTitleId { get; private set; }
        public Guid DepartmentId { get; private set; }

        public Address Address { get; private set; }

        // Navigation
        public virtual JobTitle JobTitle { get; private set; }
        public virtual Department Department { get; private set; }

        protected Employee() { }

        public Employee(string fullName, string email, string phone, DateTime birthDate, DateTime hireDate, decimal salary, Guid jobTitleId, Guid departmentId, Address address)
        {
            FullName = fullName;
            Email = email;
            Phone = phone;
            BirthDate = birthDate;
            HireDate = hireDate;
            Salary = salary;
            JobTitleId = jobTitleId;
            DepartmentId = departmentId;
            Address = address;
        }

        public void UpdateDetails(string fullName, string email, string phone, Address address)
        {
            FullName = fullName;
            Email = email;
            Phone = phone;
            Address = address;
        }

        public void UpdateJob(Guid jobTitleId, Guid departmentId, decimal salary)
        {
            JobTitleId = jobTitleId;
            DepartmentId = departmentId;
            Salary = salary;
        }

        public void Deactivate()
        {
            IsActive = false;
        }
    }
}
