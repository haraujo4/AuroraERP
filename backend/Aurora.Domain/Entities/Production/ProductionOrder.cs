using System;
using System.Collections.Generic;
using System.Linq;
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
        
        public decimal TotalMaterialCost { get; private set; }
        
        public Guid? WorkCenterId { get; private set; }
        public WorkCenter WorkCenter { get; private set; }

        private readonly List<ProductionOrderComponent> _components = new();
        public IReadOnlyCollection<ProductionOrderComponent> Components => _components.AsReadOnly();

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

        public void SetCost(decimal totalMaterialCost)
        {
            TotalMaterialCost = totalMaterialCost;
        }

        public void SetWorkCenter(Guid workCenterId)
        {
            WorkCenterId = workCenterId;
        }

        public void ExplodeComponents(BillOfMaterial bom)
        {
            if (bom.ProductId != ProductId)
                throw new InvalidOperationException("BOM does not match product.");

            _components.Clear();
            foreach (var item in bom.Items)
            {
                var qtyRequired = (item.Quantity / bom.BaseQuantity) * Quantity;
                _components.Add(new ProductionOrderComponent(Id, item.ComponentId, qtyRequired));
            }
        }

        private ProductionOrder() { }
    }
}
