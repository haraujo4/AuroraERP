using Aurora.Domain.Common;
using Aurora.Domain.Entities.Logistics;

namespace Aurora.Domain.Entities.Sales
{
    public class SalesContractItem : BaseEntity
    {
        public Guid SalesContractId { get; set; }
        public virtual SalesContract SalesContract { get; set; }

        public Guid MaterialId { get; set; }
        public virtual Material Material { get; set; }

        public decimal Quantity { get; set; }
        public decimal UnitPrice { get; set; }
        public decimal DiscountPercentage { get; set; }
        public decimal TotalValue { get; set; }
    }
}
