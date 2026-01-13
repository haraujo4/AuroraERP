using System;

namespace Aurora.Application.DTOs.HR
{
    public class DepartmentDto
    {
        public Guid Id { get; set; }
        public string Name { get; set; }
        public string? Description { get; set; }
        public Guid? ManagerId { get; set; }
    }

    public class CreateDepartmentDto
    {
        public string Name { get; set; }
        public string? Description { get; set; }
        public Guid? ManagerId { get; set; }
    }
}
