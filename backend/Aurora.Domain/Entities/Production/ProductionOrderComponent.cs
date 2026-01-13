using System;
using Aurora.Domain.Common;
using Aurora.Domain.Entities.Logistics;

namespace Aurora.Domain.Entities.Production
{
    public class ProductionOrderComponent : BaseEntity
    {
        public Guid ProductionOrderId { get; private set; }
        public ProductionOrder ProductionOrder { get; private set; }

        public Guid ComponentId { get; private set; }
        public Material Component { get; private set; }

        public decimal QuantityRequired { get; private set; }
        public decimal QuantityConsumed { get; private set; }
        public decimal QuantityReserved { get; private set; }

        public ProductionOrderComponent(Guid productionOrderId, Guid componentId, decimal quantityRequired)
        {
            ProductionOrderId = productionOrderId;
            ComponentId = componentId;
            QuantityRequired = quantityRequired;
            QuantityConsumed = 0;
            QuantityReserved = 0;
        }

        private ProductionOrderComponent() { }

        public void Consume(decimal quantity)
        {
            QuantityConsumed += quantity;
        }

        public void Reserve(decimal quantity)
        {
            QuantityReserved += quantity;
        }
    }
}
