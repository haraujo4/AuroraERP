using System;
using System.Collections.Generic;
using System.Linq;
using Aurora.Domain.Common;

namespace Aurora.Domain.Entities.Finance
{
    public class JournalEntry : BaseEntity
    {
        public DateTime PostingDate { get; private set; }
        public DateTime DocumentDate { get; private set; }
        public string Description { get; private set; }
        public string? Reference { get; private set; }
        public JournalEntryStatus Status { get; private set; }
        public Guid? ReversedEntryId { get; private set; }
        public bool IsReversal { get; private set; }
        
        private readonly List<JournalEntryLine> _lines = new List<JournalEntryLine>();
        public IReadOnlyCollection<JournalEntryLine> Lines => _lines.AsReadOnly();

        private JournalEntry() { }

        public JournalEntry(DateTime postingDate, DateTime documentDate, string description, string? reference = null)
        {
            PostingDate = postingDate;
            DocumentDate = documentDate;
            Description = description;
            Reference = reference;
            Status = JournalEntryStatus.Draft;
        }

        public void AddLine(Guid accountId, decimal amount, JournalEntryLineType type, Guid? costCenterId = null)
        {
            if (Status != JournalEntryStatus.Draft)
                throw new InvalidOperationException("Cannot modify lines of a non-draft journal entry.");

            _lines.Add(new JournalEntryLine(Id, accountId, amount, type, costCenterId));
        }

        public void Post()
        {
            if (Status != JournalEntryStatus.Draft)
                throw new InvalidOperationException("Only draft entries can be posted.");

            var debitSum = _lines.Where(l => l.Type == JournalEntryLineType.Debit).Sum(l => l.Amount);
            var creditSum = _lines.Where(l => l.Type == JournalEntryLineType.Credit).Sum(l => l.Amount);

            if (debitSum != creditSum)
                throw new InvalidOperationException($"Journal entry is out of balance. Debits: {debitSum}, Credits: {creditSum}");

            Status = JournalEntryStatus.Posted;
        }

        public void Cancel()
        {
            if (Status == JournalEntryStatus.Cancelled)
                throw new InvalidOperationException("Journal entry is already cancelled.");
            
            Status = JournalEntryStatus.Cancelled;
        }

        public JournalEntry CreateReversal(string reason)
        {
            if (Status != JournalEntryStatus.Posted)
                throw new InvalidOperationException("Only posted entries can be reversed.");
            
            if (ReversedEntryId != null)
                throw new InvalidOperationException("Entry is already reversed.");

            var reversal = new JournalEntry(DateTime.Now, DateTime.Now, $"Estorno de {Description} - Motivo: {reason}", Reference);
            reversal.IsReversal = true;

            foreach (var line in _lines)
            {
                var reversedType = line.Type == JournalEntryLineType.Debit ? JournalEntryLineType.Credit : JournalEntryLineType.Debit;
                reversal.AddLine(line.AccountId, line.Amount, reversedType, line.CostCenterId);
            }

            ReversedEntryId = reversal.Id;
            Status = JournalEntryStatus.Cancelled;

            return reversal;
        }
    }

    public enum JournalEntryStatus
    {
        Draft,
        Posted,
        Cancelled
    }
}
