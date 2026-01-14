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
        
        // Taxes
        public decimal IpiRate { get; private set; }
        public decimal IpiValue { get; private set; }
        public decimal IcmsRate { get; private set; }
        public decimal IcmsValue { get; private set; }

        public decimal TotalValue { get; private set; }

        private SalesQuoteItem() { }

        public SalesQuoteItem(Guid materialId, decimal quantity, decimal unitPrice, decimal discountPercentage = 0, decimal ipiRate = 0, decimal icmsRate = 0)
        {
            Id = Guid.NewGuid();
            MaterialId = materialId;
            Quantity = quantity;
            UnitPrice = unitPrice;
            DiscountPercentage = discountPercentage;
            IpiRate = ipiRate;
            IcmsRate = icmsRate;
            CalculateTotal();
        }

        public void CalculateTotal()
        {
            var grossValue = Quantity * UnitPrice;
            var discountValue = grossValue * (DiscountPercentage / 100);
            var netValue = grossValue - discountValue;

            IpiValue = netValue * (IpiRate / 100);
            IcmsValue = netValue * (IcmsRate / 100);

            // Total Value includes IPI (usually)
            TotalValue = netValue + IpiValue;
        }
    }
}
