using System;
using Aurora.Domain.Common;

namespace Aurora.Domain.Entities.HR
{
    public class PersonnelAction : BaseEntity
    {
        public Guid EmployeeId { get; private set; }
        public Employee Employee { get; private set; }

        public PersonnelActionType Type { get; private set; }
        public DateTime EffectiveDate { get; private set; }
        public string Reason { get; private set; }
        
        // Snapshot of change could be stored here or inferred from Employee history if temporal tables were used.
        // For now, we just log the action.

        private PersonnelAction() { }

        public PersonnelAction(Guid employeeId, PersonnelActionType type, DateTime effectiveDate, string reason)
        {
            EmployeeId = employeeId;
            Type = type;
            EffectiveDate = effectiveDate;
            Reason = reason;
        }
    }

    public enum PersonnelActionType
    {
        Hiring,
        Promotion,
        Demotion,
        Transfer,
        Termination,
        Rehiring,
        OrgAssignmentChange
    }
}
