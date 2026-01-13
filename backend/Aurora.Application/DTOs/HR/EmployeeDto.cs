using Aurora.Domain.ValueObjects;
using System;

namespace Aurora.Application.DTOs.HR
{
    public class EmployeeDto
    {
        public Guid Id { get; set; }
        public string FullName { get; set; }
        public string Email { get; set; }
        public string Phone { get; set; }
        public DateTime BirthDate { get; set; }
        public DateTime HireDate { get; set; }
        public decimal Salary { get; set; }
        public bool IsActive { get; set; }
        public Guid JobTitleId { get; set; }
        public string JobTitleName { get; set; }
        public Guid DepartmentId { get; set; }
        public string DepartmentName { get; set; }
        public Address Address { get; set; }
    }

    public class CreateEmployeeDto
    {
        public string FullName { get; set; }
        public string Email { get; set; }
        public string Phone { get; set; }
        public DateTime BirthDate { get; set; }
        public DateTime HireDate { get; set; }
        public decimal Salary { get; set; }
        public Guid JobTitleId { get; set; }
        public Guid DepartmentId { get; set; }
        public Address Address { get; set; }
    }

    public class UpdateEmployeeDto
    {
        public string FullName { get; set; }
        public string Email { get; set; }
        public string Phone { get; set; }
        public Address Address { get; set; }
        public bool IsActive { get; set; }
    }
}
