using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Aurora.Application.Interfaces.Fiscal
{
    public interface IFiscalDocumentService
    {
        Task<FiscalDocumentDto> GenerateFromInvoiceAsync(Guid invoiceId);
        Task<FiscalDocumentDto> GetByInvoiceIdAsync(Guid invoiceId);
        Task CancelAsync(Guid id);
        Task<IEnumerable<FiscalDocumentDto>> GetAllAsync();
    }

    public class FiscalDocumentDto
    {
        public Guid Id { get; set; }
        public Guid InvoiceId { get; set; }
        public string InvoiceNumber { get; set; }
        public string DocumentNumber { get; set; }
        public string Series { get; set; }
        public string AccessKey { get; set; }
        public string Status { get; set; }
        public DateTime IssuedAt { get; set; }
    }
}
