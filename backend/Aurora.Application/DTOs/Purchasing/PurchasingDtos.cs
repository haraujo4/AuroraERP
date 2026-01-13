using System;
using System.Collections.Generic;
using Aurora.Domain.Enums;

namespace Aurora.Application.DTOs.Purchasing
{
    public class CreatePurchaseRequisitionDto
    {
        public string Requester { get; set; } = string.Empty;
        public DateTime RequiredDate { get; set; }
        public List<CreatePurchaseRequisitionItemDto> Items { get; set; } = new();
    }

    public class CreatePurchaseRequisitionItemDto
    {
        public Guid MaterialId { get; set; }
        public decimal Quantity { get; set; }
        public Guid? CostCenterId { get; set; }
    }

    public class CreatePurchaseOrderDto
    {
        public Guid SupplierId { get; set; }
        public DateTime DeliveryDate { get; set; }
        public List<CreatePurchaseOrderItemDto> Items { get; set; } = new();
    }

    public class CreatePurchaseOrderItemDto
    {
        public Guid MaterialId { get; set; }
        public decimal Quantity { get; set; }
        public decimal UnitPrice { get; set; }
    }
}
