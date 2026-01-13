using System;
using System.Collections.Generic;
using Aurora.Domain.Common;
using Aurora.Domain.Enums;
using Aurora.Domain.Entities.BusinessPartners;

namespace Aurora.Domain.Entities.Purchasing
{
    public class PurchaseOrder : BaseEntity
    {
        public string OrderNumber { get; private set; }
        public DateTime OrderDate { get; private set; }
        public DateTime DeliveryDate { get; private set; }
        
        public Guid SupplierId { get; private set; }
        public BusinessPartner Supplier { get; private set; }

        public PurchasingStatus Status { get; private set; }
        public PurchaseType Type { get; private set; }
        
        public decimal TotalAmount { get; private set; }
        public string? Notes { get; private set; }

        private readonly List<PurchaseOrderItem> _items = new();
        public IReadOnlyCollection<PurchaseOrderItem> Items => _items.AsReadOnly();

        public PurchaseOrder(string orderNumber, Guid supplierId, DateTime deliveryDate)
        {
            OrderNumber = orderNumber;
            SupplierId = supplierId;
            OrderDate = DateTime.Now;
            DeliveryDate = deliveryDate;
            Status = PurchasingStatus.Draft;
            Type = PurchaseType.Standard;
        }

        public void AddItem(Guid materialId, decimal quantity, decimal unitPrice)
        {
            var item = new PurchaseOrderItem(Id, materialId, quantity, unitPrice);
            _items.Add(item);
            CalculateTotal();
        }

        public void CalculateTotal()
        {
            TotalAmount = 0;
            foreach(var item in _items)
            {
                TotalAmount += item.TotalAmount;
            }
        }

        public void Approve()
        {
             if (Status == PurchasingStatus.Draft || Status == PurchasingStatus.PendingApproval)
            {
                Status = PurchasingStatus.Approved;
            }
        }
        
        public void Cancel()
        {
            Status = PurchasingStatus.Cancelled;
        }

        public void SetStatus(PurchasingStatus status)
        {
            Status = status;
        }

        private PurchaseOrder() { }
    }
}
