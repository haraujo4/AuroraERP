using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Aurora.Domain.Enums;

namespace Aurora.Application.Interfaces.Finance
{
    public interface IInvoiceService
    {
        Task<IEnumerable<InvoiceDto>> GetAllAsync();
        Task<InvoiceDto> GetByIdAsync(Guid id);
        Task<InvoiceDto> CreateAsync(CreateInvoiceDto dto);
        Task UpdateAsync(Guid id, UpdateInvoiceDto dto);
        Task DeleteAsync(Guid id); // Only if draft
        Task PostAsync(Guid id); // Finalize and create GL entries
        Task CancelAsync(Guid id);
        Task<InvoiceDto> CreateFromPurchaseOrderAsync(Guid purchaseOrderId, DateTime issueDate, DateTime dueDate);
        Task<InvoiceDto> CreateFromSalesOrderAsync(Guid salesOrderId, DateTime issueDate, DateTime dueDate);
    }

    public class InvoiceDto
    {
        public Guid Id { get; set; }
        public string Number { get; set; } = string.Empty;
        public Guid BusinessPartnerId { get; set; }
        public string BusinessPartnerName { get; set; } = string.Empty;
        public InvoiceType Type { get; set; }
        public InvoiceStatus Status { get; set; }
        public DateTime IssueDate { get; set; }
        public DateTime DueDate { get; set; }
        public decimal GrossAmount { get; set; }
        public decimal TaxAmount { get; set; }
        public decimal NetAmount { get; set; }
        public Guid? PurchaseOrderId { get; set; }
        public Guid? SalesOrderId { get; set; }
        public List<InvoiceItemDto> Items { get; set; } = new();
    }

    public class InvoiceItemDto
    {
        public Guid Id { get; set; }
        public Guid? MaterialId { get; set; }
        public string Description { get; set; } = string.Empty;
        public decimal Quantity { get; set; }
        public decimal UnitPrice { get; set; }
        public decimal TaxAmount { get; set; }
        public decimal TotalAmount { get; set; }
        public decimal IcmsRate { get; set; }
        public decimal IpiRate { get; set; }
        public decimal PisRate { get; set; }
        public decimal CofinsRate { get; set; }
        public int? Cfop { get; set; }
    }

    public class CreateInvoiceDto
    {
        public Guid BusinessPartnerId { get; set; }
        public InvoiceType Type { get; set; }
        public DateTime IssueDate { get; set; }
        public DateTime DueDate { get; set; }
        public List<CreateInvoiceItemDto> Items { get; set; } = new();
    }

    public class CreateInvoiceItemDto
    {
        public string Description { get; set; } = string.Empty;
        public decimal Quantity { get; set; }
        public decimal UnitPrice { get; set; }
        public decimal TaxAmount { get; set; }
    }

    public class UpdateInvoiceDto
    {
        public DateTime IssueDate { get; set; }
        public DateTime DueDate { get; set; }
        // For simplicity, we might just allow updating items by replacing them or separate method
        // But for MVP, let's assume valid only for Draft
    }
}
