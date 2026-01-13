using System;
using System.Collections.Generic;
using System.Linq;
using Aurora.Domain.Common;

namespace Aurora.Domain.Entities.Logistics
{
    public enum DeliveryStatus
    {
        Draft,
        Posted,
        Cancelled
    }

    public class Delivery : BaseEntity
    {
        public string Number { get; private set; }
        public Guid SalesOrderId { get; private set; }
        public DeliveryStatus Status { get; private set; }
        public DateTime DeliveryDate { get; private set; }
        public DateTime? PostingDate { get; private set; }

        private readonly List<DeliveryItem> _items = new();
        public IReadOnlyCollection<DeliveryItem> Items => _items.AsReadOnly();

        private Delivery() { }

        public Delivery(string number, Guid salesOrderId, DateTime deliveryDate)
        {
            Number = number;
            SalesOrderId = salesOrderId;
            DeliveryDate = deliveryDate;
            Status = DeliveryStatus.Draft;
        }

        public void AddItem(Guid materialId, decimal quantity, decimal unitCost, Guid salesOrderItemId)
        {
            var item = new DeliveryItem(materialId, quantity, unitCost, salesOrderItemId);
            _items.Add(item);
        }

        public void Post()
        {
            if (Status != DeliveryStatus.Draft)
                throw new InvalidOperationException("Only draft deliveries can be posted.");
            
            Status = DeliveryStatus.Posted;
            PostingDate = DateTime.UtcNow;
        }

        public void UpdateItemCost(Guid materialId, decimal unitCost)
        {
            var item = _items.FirstOrDefault(i => i.MaterialId == materialId);
            if (item != null)
            {
                // We use reflection or internal setter if we wanted, but let's just add a method in DeliveryItem too
                item.UpdateUnitCost(unitCost);
            }
        }
    }

    public class DeliveryItem : BaseEntity
    {
        public Guid DeliveryId { get; private set; }
        public Guid MaterialId { get; private set; }
        public decimal Quantity { get; private set; }
        public decimal UnitCost { get; private set; }
        public Guid SalesOrderItemId { get; private set; } // Link back to source line

        private DeliveryItem() { }

        public DeliveryItem(Guid materialId, decimal quantity, decimal unitCost, Guid salesOrderItemId)
        {
            MaterialId = materialId;
            Quantity = quantity;
            UnitCost = unitCost;
            SalesOrderItemId = salesOrderItemId;
        }

        public void UpdateUnitCost(decimal unitCost)
        {
            UnitCost = unitCost;
        }
    }
}
