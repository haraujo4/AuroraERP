using System;

namespace Aurora.Application.DTOs.HR
{
    public class JobTitleDto
    {
        public Guid Id { get; set; }
        public string Title { get; set; }
        public string? Description { get; set; }
        public decimal BaseSalary { get; set; }
        public Guid DepartmentId { get; set; }
        public string DepartmentName { get; set; }
    }

    public class CreateJobTitleDto
    {
        public string Title { get; set; }
        public string? Description { get; set; }
        public decimal BaseSalary { get; set; }
        public Guid DepartmentId { get; set; }
    }
}
