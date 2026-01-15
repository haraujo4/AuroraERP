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

        public Guid? BusinessPartnerId { get; private set; }
        public Aurora.Domain.Entities.BusinessPartners.BusinessPartner? BusinessPartner { get; private set; }

        public decimal Amount { get; private set; }
        public JournalEntryLineType Type { get; private set; }

        public Guid? ClearingId { get; private set; }
        public DateTime? ClearedAt { get; private set; }
        public bool IsCleared => ClearingId != null;

        public Guid? CostCenterId { get; private set; }
        public CentroCusto? CostCenter { get; private set; }

        public Guid? ProfitCenterId { get; private set; }
        public CentroLucro? ProfitCenter { get; private set; }

        private JournalEntryLine() { }

        public JournalEntryLine(Guid journalEntryId, Guid accountId, decimal amount, JournalEntryLineType type, Guid? costCenterId = null, Guid? profitCenterId = null, Guid? businessPartnerId = null)
        {
            JournalEntryId = journalEntryId;
            AccountId = accountId;
            Amount = amount;
            Type = type;
            CostCenterId = costCenterId;
            ProfitCenterId = profitCenterId;
            BusinessPartnerId = businessPartnerId;
        }

        public void Clear(Guid clearingId)
        {
            if (IsCleared)
                throw new InvalidOperationException("Line is already cleared.");
            
            ClearingId = clearingId;
            ClearedAt = DateTime.Now;
        }
    }

    public enum JournalEntryLineType
    {
        Debit,
        Credit
    }
}
