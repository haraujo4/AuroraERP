using System;
using Aurora.Domain.Common;
using Aurora.Domain.Entities.Logistics;

namespace Aurora.Domain.Entities.Sales
{
    public class SalesQuoteItem : BaseEntity
    {
        public Guid SalesQuoteId { get; private set; }
        
        public Guid MaterialId { get; private set; }
        public Material Material { get; private set; }

        public decimal Quantity { get; private set; }
        public decimal UnitPrice { get; private set; }
        public decimal DiscountPercentage { get; private set; }
        public decimal TotalValue { get; private set; }

        private SalesQuoteItem() { }

        public SalesQuoteItem(Guid materialId, decimal quantity, decimal unitPrice, decimal discountPercentage = 0)
        {
            Id = Guid.NewGuid();
            MaterialId = materialId;
            Quantity = quantity;
            UnitPrice = unitPrice;
            DiscountPercentage = discountPercentage;
            CalculateTotal();
        }

        public void CalculateTotal()
        {
            var grossValue = Quantity * UnitPrice;
            var discountValue = grossValue * (DiscountPercentage / 100);
            TotalValue = grossValue - discountValue;
        }
    }
}
