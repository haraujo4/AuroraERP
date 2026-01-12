using System;
using System.Collections.Generic;

namespace Aurora.Application.DTOs.Sales
{
    public class SalesOrderDto
    {
        public Guid Id { get; set; }
        public string Number { get; set; }
        public Guid BusinessPartnerId { get; set; }
        public string BusinessPartnerName { get; set; }
        public Guid? QuoteId { get; set; }
        public string? QuoteNumber { get; set; }
        public DateTime OrderDate { get; set; }
        public string Status { get; set; }
        public decimal TotalValue { get; set; }
        public List<SalesOrderItemDto> Items { get; set; } = new();
    }

    public class SalesOrderItemDto
    {
        public Guid Id { get; set; }
        public Guid MaterialId { get; set; }
        public string MaterialName { get; set; }
        public decimal Quantity { get; set; }
        public decimal UnitPrice { get; set; }
        public decimal DiscountPercentage { get; set; }
        public decimal TotalValue { get; set; }
    }

    public class CreateSalesOrderDto
    {
        public Guid BusinessPartnerId { get; set; }
        public Guid? QuoteId { get; set; }
        public DateTime OrderDate { get; set; }
        public List<CreateSalesOrderItemDto> Items { get; set; } = new();
    }

    public class CreateSalesOrderItemDto
    {
        public Guid MaterialId { get; set; }
        public decimal Quantity { get; set; }
        public decimal UnitPrice { get; set; }
        public decimal DiscountPercentage { get; set; }
    }

    public class UpdateSalesOrderStatusDto
    {
        public string Status { get; set; }
    }
}
