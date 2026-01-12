using System;
using System.Collections.Generic;
using System.Linq;
using Aurora.Domain.Common;
using Aurora.Domain.Entities.BusinessPartners;
using Aurora.Domain.Entities.CRM;

namespace Aurora.Domain.Entities.Sales
{
    public enum SalesQuoteStatus
    {
        Draft,
        Sent,
        Accepted,
        Rejected,
        Converted // To Sales Order
    }

    public class SalesQuote : BaseEntity
    {
        public string Number { get; private set; } // Auto-generated human readable ID (e.g., QT-2024-0001)
        
        public Guid BusinessPartnerId { get; private set; }
        public BusinessPartner BusinessPartner { get; private set; }

        public Guid? OpportunityId { get; private set; }
        public Opportunity? Opportunity { get; private set; }

        public DateTime ValidUntil { get; private set; }
        public SalesQuoteStatus Status { get; private set; }
        public decimal TotalValue { get; private set; }
        
        private readonly List<SalesQuoteItem> _items = new();
        public IReadOnlyCollection<SalesQuoteItem> Items => _items.AsReadOnly();

        private SalesQuote() { }

        public SalesQuote(string number, Guid businessPartnerId, DateTime validUntil, Guid? opportunityId = null)
        {
            Number = number;
            BusinessPartnerId = businessPartnerId;
            ValidUntil = validUntil;
            OpportunityId = opportunityId;
            Status = SalesQuoteStatus.Draft;
            TotalValue = 0;
        }

        public void AddItem(Guid materialId, decimal quantity, decimal unitPrice, decimal discountPercentage = 0)
        {
            var item = new SalesQuoteItem(materialId, quantity, unitPrice, discountPercentage);
            _items.Add(item);
            CalculateTotal();
        }

        public void CalculateTotal()
        {
            TotalValue = _items.Sum(i => i.TotalValue);
        }

        public void UpdateStatus(SalesQuoteStatus status)
        {
            Status = status;
        }
    }
}
