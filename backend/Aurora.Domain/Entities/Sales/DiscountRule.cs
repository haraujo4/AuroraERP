using System;
using Aurora.Domain.Common;

namespace Aurora.Domain.Entities.Sales
{
    public class DiscountRule : BaseEntity
    {
        public string Name { get; private set; }
        public DiscountType Type { get; private set; }
        public decimal Value { get; private set; }
        
        // Conditions
        public decimal MinimumQuantity { get; private set; }
        public Guid? BusinessPartnerId { get; private set; }
        public Guid? MaterialId { get; private set; }
        
        public DateTime StartDate { get; private set; }
        public DateTime EndDate { get; private set; }
        public bool IsActive { get; private set; }

        public DiscountRule(string name, DiscountType type, decimal value, DateTime startDate, DateTime endDate)
        {
            Name = name;
            Type = type;
            Value = value;
            StartDate = startDate;
            EndDate = endDate;
            IsActive = true;
        }

        private DiscountRule() { }

        public void SetConditions(decimal minQty, Guid? bpId = null, Guid? materialId = null)
        {
            MinimumQuantity = minQty;
            BusinessPartnerId = bpId;
            MaterialId = materialId;
        }
    }

    public enum DiscountType
    {
        Percentage,
        FixedAmount
    }
}
