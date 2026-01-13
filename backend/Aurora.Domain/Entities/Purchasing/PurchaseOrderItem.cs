using System;
using Aurora.Domain.Common;
using Aurora.Domain.Entities.Logistics;

namespace Aurora.Domain.Entities.Purchasing
{
    public class PurchaseOrderItem : BaseEntity
    {
        public Guid OrderId { get; private set; }
        public PurchaseOrder Order { get; private set; }

        public Guid MaterialId { get; private set; }
        public Material Material { get; private set; }

        public decimal Quantity { get; private set; }
        public decimal UnitPrice { get; private set; }
        public decimal TotalAmount { get; private set; }
        public decimal ReceivedQuantity { get; private set; }

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
        public decimal TotalTaxAmount { get; private set; }

        public PurchaseOrderItem(Guid orderId, Guid materialId, decimal quantity, decimal unitPrice)
        {
            OrderId = orderId;
            MaterialId = materialId;
            Quantity = quantity;
            UnitPrice = unitPrice;
            TotalAmount = quantity * unitPrice;
            ReceivedQuantity = 0;
            IsActive = true;
        }

        public void Receive(decimal quantity)
        {
            ReceivedQuantity += quantity;
        }

        public void SetFiscalInfo(int cfop, decimal icmsRate, decimal ipiRate, decimal pisRate, decimal cofinsRate)
        {
            Cfop = cfop;
            IcmsRate = icmsRate;
            IpiRate = ipiRate;
            PisRate = pisRate;
            CofinsRate = cofinsRate;

            IcmsValue = TotalAmount * (icmsRate / 100);
            IpiValue = TotalAmount * (ipiRate / 100);
            PisValue = TotalAmount * (pisRate / 100);
            CofinsValue = TotalAmount * (cofinsRate / 100);
            
            TotalTaxAmount = IcmsValue + IpiValue + PisValue + CofinsValue;
        }

        private PurchaseOrderItem() { }
    }
}
