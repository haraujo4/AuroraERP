using Aurora.Application.Interfaces.Events;
using System;

namespace Aurora.Application.Events.HR
{
    public class EmployeeAdmittedEvent : IIntegrationEvent
    {
        public Guid Id { get; } = Guid.NewGuid();
        public DateTime OccurredOn { get; } = DateTime.Now;
        public string EmployeeName { get; }
        public string DepartmentName { get; }

        public EmployeeAdmittedEvent(string employeeName, string departmentName)
        {
            EmployeeName = employeeName;
            DepartmentName = departmentName;
        }
    }
}
