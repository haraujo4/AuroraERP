using System;
using System.Collections.Generic;
using System.Linq;
using Aurora.Domain.Common;
using Aurora.Domain.Entities.BusinessPartners;

namespace Aurora.Domain.Entities.Sales
{
    public enum SalesOrderStatus
    {
        Draft,
        Confirmed,
        Processing,
        Shipped,
        Invoiced,
        Cancelled
    }

    public class SalesOrder : BaseEntity
    {
        public string Number { get; private set; }
        public Guid BusinessPartnerId { get; private set; }
        public BusinessPartner BusinessPartner { get; private set; }

        public Guid? QuoteId { get; private set; }
        public SalesQuote? Quote { get; private set; }

        public DateTime OrderDate { get; private set; }
        public DateTime? DeliveryDate { get; private set; }
        
        public SalesOrderStatus Status { get; private set; }
        public decimal TotalValue { get; private set; }
        
        private readonly List<SalesOrderItem> _items = new();
        public IReadOnlyCollection<SalesOrderItem> Items => _items.AsReadOnly();

        private SalesOrder() { }

        public SalesOrder(string number, Guid businessPartnerId, DateTime orderDate, Guid? quoteId = null)
        {
            Number = number;
            BusinessPartnerId = businessPartnerId;
            OrderDate = orderDate;
            QuoteId = quoteId;
            Status = SalesOrderStatus.Draft;
            TotalValue = 0;
        }

        public void AddItem(Guid materialId, decimal quantity, decimal unitPrice, decimal discountPercentage = 0)
        {
            var item = new SalesOrderItem(materialId, quantity, unitPrice, discountPercentage);
            _items.Add(item);
            CalculateTotal();
        }

        public void CalculateTotal()
        {
            TotalValue = _items.Sum(i => i.TotalValue);
        }

        public void UpdateStatus(SalesOrderStatus status)
        {
            Status = status;
        }
    }
}
