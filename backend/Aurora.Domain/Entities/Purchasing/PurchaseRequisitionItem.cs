using System;
using Aurora.Domain.Common;
using Aurora.Domain.Entities.Logistics;
using Aurora.Domain.Entities.Organization;

namespace Aurora.Domain.Entities.Purchasing
{
    public class PurchaseRequisitionItem : BaseEntity
    {
        public Guid RequisitionId { get; private set; }
        public PurchaseRequisition Requisition { get; private set; }

        public Guid MaterialId { get; private set; }
        public Material Material { get; private set; }

        public decimal Quantity { get; private set; }
        
        public Guid? CostCenterId { get; private set; }
        public CentroCusto? CostCenter { get; private set; }

        public PurchaseRequisitionItem(Guid requisitionId, Guid materialId, decimal quantity, Guid? costCenterId)
        {
            RequisitionId = requisitionId;
            MaterialId = materialId;
            Quantity = quantity;
            CostCenterId = costCenterId;
            IsActive = true;
        }

        private PurchaseRequisitionItem() { }
    }
}
