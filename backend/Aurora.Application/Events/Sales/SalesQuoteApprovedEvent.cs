using Aurora.Application.Interfaces.Events;
using System;

namespace Aurora.Application.Events.Sales
{
    public class SalesQuoteApprovedEvent : IIntegrationEvent
    {
        public Guid Id { get; } = Guid.NewGuid();
        public DateTime OccurredOn { get; } = DateTime.Now;
        public Guid QuoteId { get; }
        public string CustomerName { get; }
        public string CustomerEmail { get; }
        public decimal TotalValue { get; }

        public SalesQuoteApprovedEvent(Guid quoteId, string customerName, string customerEmail, decimal totalValue)
        {
            QuoteId = quoteId;
            CustomerName = customerName;
            CustomerEmail = customerEmail;
            TotalValue = totalValue;
        }
    }
}
