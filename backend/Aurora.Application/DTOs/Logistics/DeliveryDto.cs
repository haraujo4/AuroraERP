using System;
using System.Collections.Generic;
using Aurora.Domain.Entities.Logistics;

namespace Aurora.Application.DTOs.Logistics
{
    public class CreateDeliveryDto
    {
        public Guid SalesOrderId { get; set; }
        public DateTime DeliveryDate { get; set; }
    }

    public class DeliveryDto
    {
        public Guid Id { get; set; }
        public string Number { get; set; }
        public Guid SalesOrderId { get; set; }
        public string SalesOrderNumber { get; set; }
        public string Status { get; set; }
        public DateTime DeliveryDate { get; set; }
        public DateTime? PostingDate { get; set; }
        public List<DeliveryItemDto> Items { get; set; } = new();
    }

    public class DeliveryItemDto
    {
        public Guid Id { get; set; }
        public Guid MaterialId { get; set; }
        public string MaterialName { get; set; }
        public decimal Quantity { get; set; }
        public Guid SalesOrderItemId { get; set; }
    }
}
