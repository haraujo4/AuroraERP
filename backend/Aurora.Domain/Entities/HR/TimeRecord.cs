using System;
using Aurora.Domain.Common;

namespace Aurora.Domain.Entities.HR
{
    public class TimeRecord : BaseEntity
    {
        public Guid EmployeeId { get; private set; }
        public Employee Employee { get; private set; }

        public DateTime Date { get; private set; }
        public TimeRecordType Type { get; private set; }
        public decimal Hours { get; private set; } // e.g., 8.0 for full day, -4.0 for half day absence, or maybe just a positive number and type dictates semantics
        public string? Note { get; private set; }
        public bool IsApproved { get; private set; }

        private TimeRecord() { }

        public TimeRecord(Guid employeeId, DateTime date, TimeRecordType type, decimal hours, string? note = null)
        {
            EmployeeId = employeeId;
            Date = date;
            Type = type;
            Hours = hours;
            Note = note;
            IsApproved = false; // Default requires approval
        }

        public void Approve()
        {
            IsApproved = true;
        }
    }

    public enum TimeRecordType
    {
        RegularWork,
        Overtime,
        Absence_Sick,
        Absence_Vacation,
        Absence_Unpaid
    }
}
