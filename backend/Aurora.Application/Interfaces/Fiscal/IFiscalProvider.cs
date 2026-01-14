using System;
using System.Threading.Tasks;
using Aurora.Domain.Entities.Fiscal;
using Aurora.Domain.Entities.Finance;
using Aurora.Domain.Entities.BusinessPartners;

namespace Aurora.Application.Interfaces.Fiscal
{
    public interface IFiscalProvider
    {
        // Provider implementation decides how to map invoice/bp to its specific payload
        Task<string> EmitirNfeAsync(FiscalDocument document, Invoice invoice, BusinessPartner bp);
        Task<FiscalDocumentStatusResponse> ConsultarNfeAsync(string providerReference);
    }

    public class FiscalDocumentStatusResponse
    {
        public string Status { get; set; } // "Authorized", "Rejected", "Processing"
        public string Protocol { get; set; }
        public string XmlUrl { get; set; }
        public string PdfUrl { get; set; }
        public string Message { get; set; }
    }
}
