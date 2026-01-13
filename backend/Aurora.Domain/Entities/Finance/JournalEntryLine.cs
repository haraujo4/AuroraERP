using System;
using Aurora.Domain.Common;
using Aurora.Domain.Entities.Organization;

namespace Aurora.Domain.Entities.Finance
{
    public class JournalEntryLine : BaseEntity
    {
        public Guid JournalEntryId { get; private set; }
        public JournalEntry JournalEntry { get; private set; }

        public Guid AccountId { get; private set; }
        public Account Account { get; private set; }

        public decimal Amount { get; private set; }
        public JournalEntryLineType Type { get; private set; }

        public Guid? CostCenterId { get; private set; }
        public CentroCusto? CostCenter { get; private set; }

        private JournalEntryLine() { }

        public JournalEntryLine(Guid journalEntryId, Guid accountId, decimal amount, JournalEntryLineType type, Guid? costCenterId = null)
        {
            JournalEntryId = journalEntryId;
            AccountId = accountId;
            Amount = amount;
            Type = type;
            CostCenterId = costCenterId;
        }
    }

    public enum JournalEntryLineType
    {
        Debit,
        Credit
    }
}
