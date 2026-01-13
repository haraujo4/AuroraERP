using System;
using Aurora.Domain.Common;
using Aurora.Domain.Entities.Logistics;

namespace Aurora.Domain.Entities.Production
{
    public class BillOfMaterialItem : BaseEntity
    {
        public Guid BillOfMaterialId { get; private set; }
        public BillOfMaterial BillOfMaterial { get; private set; }

        public Guid ComponentId { get; private set; }
        public Material Component { get; private set; }

        public decimal Quantity { get; private set; }

        public BillOfMaterialItem(Guid billOfMaterialId, Guid componentId, decimal quantity)
        {
            BillOfMaterialId = billOfMaterialId;
            ComponentId = componentId;
            Quantity = quantity;
        }

        private BillOfMaterialItem() { }
    }
}
