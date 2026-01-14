using System;
using System.Threading.Tasks;
using Aurora.Domain.Entities.Fiscal;

namespace Aurora.Application.Interfaces.Fiscal
{
    public interface IFiscalService
    {
        Task<FiscalDocument> EmitirNotaFiscalAsync(Guid invoiceId);
        Task<FiscalDocument> ConsultarStatusAsync(Guid fiscalDocumentId);
    }
}
