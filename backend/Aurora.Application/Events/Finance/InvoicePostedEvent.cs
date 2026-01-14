using Aurora.Application.Interfaces.Events;
using System;

namespace Aurora.Application.Events.Finance
{
    public class InvoicePostedEvent : IIntegrationEvent
    {
        public Guid Id { get; } = Guid.NewGuid();
        public DateTime OccurredOn { get; } = DateTime.Now;
        public Guid InvoiceId { get; }
        public string Number { get; }
        public string CustomerName { get; }
        public string CustomerEmail { get; }
        public decimal Amount { get; }
        public DateTime DueDate { get; }

        public InvoicePostedEvent(Guid invoiceId, string number, string customerName, string customerEmail, decimal amount, DateTime dueDate)
        {
            InvoiceId = invoiceId;
            Number = number;
            CustomerName = customerName;
            CustomerEmail = customerEmail;
            Amount = amount;
            DueDate = dueDate;
        }
    }
}
