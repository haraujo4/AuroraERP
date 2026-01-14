
using System;
using System.Threading.Tasks;
using Aurora.Domain.Entities.Fiscal;

namespace Aurora.Application.Interfaces.Fiscal
{
    public interface IFiscalService
    {
        Task<FiscalDocument> EmitirNotaFiscalAsync(Guid invoiceId);
        Task<FiscalDocument> ConsultarStatusAsync(Guid fiscalDocumentId);
        Task CancelInvoiceAsync(Guid invoiceId, string reason);
        Task<byte[]> GetPdfBytesAsync(Guid invoiceId);
    }
}
