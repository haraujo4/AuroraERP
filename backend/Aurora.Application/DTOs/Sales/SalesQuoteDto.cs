using System;
using System.Collections.Generic;

namespace Aurora.Application.DTOs.Sales
{
    public class SalesQuoteDto
    {
        public Guid Id { get; set; }
        public string Number { get; set; }
        public Guid BusinessPartnerId { get; set; }
        public string BusinessPartnerName { get; set; }
        public Guid? OpportunityId { get; set; }
        public string? OpportunityTitle { get; set; }
        public DateTime QuoteDate { get; set; }
        public DateTime ValidUntil { get; set; }
        public string Status { get; set; }
        public decimal TotalValue { get; set; }
        public string? PaymentCondition { get; set; }
        public string FreightType { get; set; }
        public List<SalesQuoteItemDto> Items { get; set; } = new();
    }

    public class SalesQuoteItemDto
    {
        public Guid Id { get; set; }
        public Guid MaterialId { get; set; }
        public string MaterialName { get; set; }
        public decimal Quantity { get; set; }
        public decimal UnitPrice { get; set; }
        public decimal DiscountPercentage { get; set; }
        public decimal IpiRate { get; set; }
        public decimal IpiValue { get; set; }
        public decimal IcmsRate { get; set; }
        public decimal IcmsValue { get; set; }
        public decimal TotalValue { get; set; }
    }

    public class CreateSalesQuoteDto
    {
        public Guid BusinessPartnerId { get; set; }
        public Guid? OpportunityId { get; set; }
        public DateTime ValidUntil { get; set; }
        public string? PaymentCondition { get; set; }
        public string FreightType { get; set; }
        public List<CreateSalesQuoteItemDto> Items { get; set; } = new();
    }

    public class CreateSalesQuoteItemDto
    {
        public Guid MaterialId { get; set; }
        public decimal Quantity { get; set; }
        public decimal UnitPrice { get; set; }
        public decimal DiscountPercentage { get; set; }
        public decimal IpiRate { get; set; }
        public decimal IcmsRate { get; set; }
    }

    public class UpdateSalesQuoteStatusDto
    {
        public string Status { get; set; }
    }
}
