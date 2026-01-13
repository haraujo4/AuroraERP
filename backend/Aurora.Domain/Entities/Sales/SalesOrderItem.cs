using System;
using Aurora.Domain.Common;
using Aurora.Domain.Entities.Logistics;

namespace Aurora.Domain.Entities.Sales
{
    public class SalesOrderItem : BaseEntity
    {
        public Guid SalesOrderId { get; private set; }
        
        public Guid MaterialId { get; private set; }
        public Material Material { get; private set; }

        public decimal Quantity { get; private set; }
        public decimal UnitPrice { get; private set; }
        public decimal DiscountPercentage { get; private set; }
        public decimal TotalValue { get; private set; }

        // Fiscal Fields
        public int? Cfop { get; private set; }
        public decimal IcmsRate { get; private set; }
        public decimal IcmsValue { get; private set; }
        public decimal IpiRate { get; private set; }
        public decimal IpiValue { get; private set; }
        public decimal PisRate { get; private set; }
        public decimal PisValue { get; private set; }
        public decimal CofinsRate { get; private set; }
        public decimal CofinsValue { get; private set; }
        public decimal TotalTaxValue { get; private set; }

        private SalesOrderItem() { }

        public SalesOrderItem(Guid materialId, decimal quantity, decimal unitPrice, decimal discountPercentage = 0)
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

        public void SetFiscalInfo(int cfop, decimal icmsRate, decimal ipiRate, decimal pisRate, decimal cofinsRate)
        {
            Cfop = cfop;
            IcmsRate = icmsRate;
            IpiRate = ipiRate;
            PisRate = pisRate;
            CofinsRate = cofinsRate;

            IcmsValue = TotalValue * (icmsRate / 100);
            IpiValue = TotalValue * (ipiRate / 100);
            PisValue = TotalValue * (pisRate / 100);
            CofinsValue = TotalValue * (cofinsRate / 100);
            
            TotalTaxValue = IcmsValue + IpiValue + PisValue + CofinsValue;
        }
    }
}
