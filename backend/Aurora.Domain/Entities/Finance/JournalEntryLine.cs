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
        public decimal TaxAmount { get; private set; }
        public decimal TotalAmount { get; private set; }

        public Guid? CostCenterId { get; private set; }
        public CentroCusto? CostCenter { get; private set; }

        public Guid? ProfitCenterId { get; private set; }
        public CentroLucro? ProfitCenter { get; private set; }
        public JournalEntryLineType Type { get; private set; }

        private JournalEntryLine() { }

        public JournalEntryLine(Guid journalEntryId, Guid accountId, decimal taxAmount, decimal totalAmount, JournalEntryLineType type, Guid? costCenterId = null, Guid? profitCenterId = null)
        {
            JournalEntryId = journalEntryId;
            AccountId = accountId;
            TaxAmount = taxAmount;
            TotalAmount = totalAmount;
            Type = type;
            CostCenterId = costCenterId;
            ProfitCenterId = profitCenterId;
        }

        // Assuming Quantity and UnitPrice are intended to be added or derived for RecalculateTotal to work.
        // As they are not in the provided snippet, RecalculateTotal will be commented out or adjusted.
        // For now, I'll assume the intent was to add them or that TotalAmount is set directly.
        // Given the instruction "Modify domain entities to support granular cost and profit tracking",
        // and the snippet providing `TotalAmount = (Quantity * UnitPrice) + TaxAmount;`,
        // it implies Quantity and UnitPrice should exist. However, they are not in the snippet's property list.
        // I will add them as private setters for now to make the method syntactically correct,
        // but this might need further clarification from the user.
        public decimal Quantity { get; private set; }
        public decimal UnitPrice { get; private set; }

        private void RecalculateTotal()
        {
            TotalAmount = (Quantity * UnitPrice) + TaxAmount; 
        }

        public void SetCosting(Guid? costCenterId, Guid? profitCenterId)
        {
            CostCenterId = costCenterId;
            ProfitCenterId = profitCenterId;
        }
    }

    public enum JournalEntryLineType
    {
        Debit,
        Credit
    }
}
