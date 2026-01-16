using System;
using System.Collections.Generic;
using Aurora.Domain.Common;

namespace Aurora.Domain.Entities.Finance
{
    public class PaymentRun : BaseEntity
    {
        public string Identification { get; private set; } // e.g. "RUN-20260115"
        public DateTime RunDate { get; private set; }
        public PaymentRunStatus Status { get; private set; }
        public DateTime? ExecutionDate { get; private set; }
        
        public List<Payment> Payments { get; private set; } = new();

        private PaymentRun() { }

        public PaymentRun(string identification, DateTime runDate)
        {
            Identification = identification;
            RunDate = runDate;
            Status = PaymentRunStatus.Proposal;
        }

        public void Execute()
        {
            if (Status != PaymentRunStatus.Proposal) throw new InvalidOperationException("Run already executed or cancelled.");
            
            Status = PaymentRunStatus.PaymentExecuted;
            ExecutionDate = DateTime.UtcNow;

            foreach (var payment in Payments)
            {
                payment.MarkAsPosted(); // Helper method on Payment to update its status
            }
        }
    }

    public enum PaymentRunStatus
    {
        Proposal,
        PaymentExecuted,
        Cancelled
    }
}
