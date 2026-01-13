using System;
using Aurora.Domain.Common;
using Aurora.Domain.Entities.BusinessPartners;
using Aurora.Domain.Enums;

namespace Aurora.Domain.Entities.Finance
{
    public class Payment : BaseEntity
    {
        public Guid BusinessPartnerId { get; private set; }
        public BusinessPartner BusinessPartner { get; private set; }

        public Guid? InvoiceId { get; private set; }
        public Invoice Invoice { get; private set; }

        public Guid AccountId { get; private set; }
        public PaymentStatus Status { get; private set; }
        public string Reference { get; private set; }

        public decimal Amount { get; private set; }
        public DateTime PaymentDate { get; private set; }
        public PaymentMethod Method { get; private set; }

        public Payment(Guid businessPartnerId, decimal amount, DateTime paymentDate, PaymentMethod method, Guid accountId, string reference = "", Guid? invoiceId = null)
        {
            BusinessPartnerId = businessPartnerId;
            Amount = amount;
            PaymentDate = paymentDate;
            Method = method;
            AccountId = accountId;
            Reference = reference;
            InvoiceId = invoiceId;
            Status = PaymentStatus.Draft;
        }

        public void MarkAsPosted()
        {
            if (Status != PaymentStatus.Draft)
                throw new InvalidOperationException("Payment is not in Draft status.");
            Status = PaymentStatus.Posted;
        }

        public void Cancel()
        {
            Status = PaymentStatus.Cancelled;
        }

        // EF Core Constructor
        private Payment() { }
    }
}
