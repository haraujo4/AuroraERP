using System;
using Aurora.Domain.Common;
using Aurora.Domain.Entities.Logistics;
using Aurora.Domain.Enums;

namespace Aurora.Domain.Entities.Production
{
    public class ProductionOrder : BaseEntity
    {
        public string OrderNumber { get; private set; }
        public Guid ProductId { get; private set; }
        public Material Product { get; private set; }
        
        public decimal Quantity { get; private set; }
        public ProductionOrderStatus Status { get; private set; }
        
        public DateTime StartDate { get; private set; } // Planned
        public DateTime EndDate { get; private set; } // Planned
        
        public Guid? WorkCenterId { get; private set; }
        public WorkCenter WorkCenter { get; private set; }

        public ProductionOrder(string orderNumber, Guid productId, decimal quantity, DateTime startDate, DateTime endDate)
        {
            OrderNumber = orderNumber;
            ProductId = productId;
            Quantity = quantity;
            StartDate = startDate;
            EndDate = endDate;
            Status = ProductionOrderStatus.Created;
        }

        public void Release()
        {
            if (Status == ProductionOrderStatus.Created)
                Status = ProductionOrderStatus.Released;
        }

        public void Start()
        {
            if (Status == ProductionOrderStatus.Released)
                Status = ProductionOrderStatus.InProgress;
        }

        public void Complete()
        {
             if (Status == ProductionOrderStatus.InProgress || Status == ProductionOrderStatus.Released)
                Status = ProductionOrderStatus.Completed;
        }

        public void SetWorkCenter(Guid workCenterId)
        {
            WorkCenterId = workCenterId;
        }

        private ProductionOrder() { }
    }
}
