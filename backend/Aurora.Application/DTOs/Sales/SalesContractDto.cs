using System;
using System.Collections.Generic;
using Aurora.Application.DTOs.BusinessPartners;

namespace Aurora.Application.DTOs.Sales
{
    public class SalesContractDto
    {
        public Guid Id { get; set; }
        public string ContractNumber { get; set; }
        public Guid BusinessPartnerId { get; set; }
        public string BusinessPartnerName { get; set; }
        public DateTime StartDate { get; set; }
        public DateTime EndDate { get; set; }
        public int BillingDay { get; set; }
        public string BillingFrequency { get; set; }
        public string Status { get; set; }
        public decimal TotalMonthlyValue { get; set; }
        public List<SalesContractItemDto> Items { get; set; } = new();
    }

    public class SalesContractItemDto
    {
        public Guid Id { get; set; }
        public Guid MaterialId { get; set; }
        public string MaterialName { get; set; }
        public decimal Quantity { get; set; }
        public decimal UnitPrice { get; set; }
        public decimal DiscountPercentage { get; set; }
        public decimal TotalValue { get; set; }
    }

    public class CreateSalesContractDto
    {
        public Guid BusinessPartnerId { get; set; }
        public DateTime StartDate { get; set; }
        public DateTime EndDate { get; set; }
        public int BillingDay { get; set; }
        public string BillingFrequency { get; set; }
        public List<CreateSalesContractItemDto> Items { get; set; } = new();
    }

    public class CreateSalesContractItemDto
    {
        public Guid MaterialId { get; set; }
        public decimal Quantity { get; set; }
        public decimal UnitPrice { get; set; }
        public decimal DiscountPercentage { get; set; }
    }
    
    public class UpdateSalesContractDto : CreateSalesContractDto
    {
    }
}
