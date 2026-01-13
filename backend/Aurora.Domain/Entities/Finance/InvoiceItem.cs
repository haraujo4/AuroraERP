using System;
using Aurora.Domain.Common;

namespace Aurora.Domain.Entities.Finance
{
    public class InvoiceItem : BaseEntity
    {
        public Guid InvoiceId { get; private set; }
        public Invoice Invoice { get; private set; }

        public string Description { get; private set; }
        public Guid? MaterialId { get; private set; }
        public decimal Quantity { get; private set; }
        public decimal UnitPrice { get; private set; }
        public decimal TaxAmount { get; private set; }
        public decimal TotalAmount { get; private set; }

        // Tax Details
        public decimal IcmsRate { get; private set; }
        public decimal IcmsValue { get; private set; }
        public decimal IpiRate { get; private set; }
        public decimal IpiValue { get; private set; }
        public decimal PisRate { get; private set; }
        public decimal PisValue { get; private set; }
        public decimal CofinsRate { get; private set; }
        public decimal CofinsValue { get; private set; }
        public int? Cfop { get; private set; }

        public InvoiceItem(Guid invoiceId, string description, decimal quantity, decimal unitPrice, decimal taxAmount)
        {
            InvoiceId = invoiceId;
            Description = description;
            Quantity = quantity;
            UnitPrice = unitPrice;
            TaxAmount = taxAmount;
            RecalculateTotal();
        }

        // EF Core Constructor
        private InvoiceItem() { }

        public void SetMaterial(Guid materialId)
        {
            MaterialId = materialId;
        }

        public void SetFiscalDetails(int cfop, decimal icmsRate, decimal ipiRate, decimal pisRate, decimal cofinsRate)
        {
            Cfop = cfop;
            IcmsRate = icmsRate;
            IpiRate = ipiRate;
            PisRate = pisRate;
            CofinsRate = cofinsRate;

            var baseValue = Quantity * UnitPrice;
            IcmsValue = baseValue * (icmsRate / 100);
            IpiValue = baseValue * (ipiRate / 100);
            PisValue = baseValue * (pisRate / 100);
            CofinsValue = baseValue * (cofinsRate / 100);
            
            TaxAmount = IcmsValue + IpiValue + PisValue + CofinsValue;
            RecalculateTotal();
        }

        private void RecalculateTotal()
        {
            TotalAmount = (Quantity * UnitPrice) + TaxAmount; 
        }
    }
}
