using System;
using System.Threading.Tasks;
using Aurora.Application.Interfaces.Fiscal;
using Aurora.Application.Interfaces.Repositories;
using Aurora.Domain.Entities.Fiscal;
using Aurora.Domain.Entities.Finance;
using Aurora.Domain.Enums;
using System.Linq;

namespace Aurora.Application.Services.Fiscal
{
    public class FiscalService : IFiscalService
    {
        private readonly IFiscalProvider _fiscalProvider;
        private readonly IRepository<FiscalDocument> _fiscalRepository;
        private readonly IRepository<Invoice> _invoiceRepository;
        private readonly IRepository<Aurora.Domain.Entities.BusinessPartners.BusinessPartner> _bpRepository;

        public FiscalService(
            IFiscalProvider fiscalProvider,
            IRepository<FiscalDocument> fiscalRepository,
            IRepository<Invoice> invoiceRepository,
            IRepository<Aurora.Domain.Entities.BusinessPartners.BusinessPartner> bpRepository)
        {
            _fiscalProvider = fiscalProvider;
            _fiscalRepository = fiscalRepository;
            _invoiceRepository = invoiceRepository;
            _bpRepository = bpRepository;
        }

        public async Task<FiscalDocument> EmitirNotaFiscalAsync(Guid invoiceId)
        {
            // 1. Get Invoice with details
            var invoice = await _invoiceRepository.GetByIdAsync(invoiceId, i => i.Items, i => i.BusinessPartner);
            if (invoice == null) throw new Exception("Invoice not found.");

            // 2. Validate Rules (e.g. status)
            if (invoice.Status != InvoiceStatus.Posted)
                 // For MVP we might allow draft if user explicitly requests, but doc says "Evento de faturamento aprovado" (Posted)
                 throw new Exception("Invoice must be posted before emitting fiscal document.");

            // 3. Create Fiscal Document Record (Draft)
            // Check if already exists
            var existing = (await _fiscalRepository.FindAsync(f => f.InvoiceId == invoiceId)).FirstOrDefault();
            if (existing != null && existing.Status == FiscalDocumentStatus.Authorized)
                return existing;

            var fiscalDoc = existing ?? new FiscalDocument(invoice.Id, invoice.Number, "1", Guid.NewGuid().ToString("N"));
            if (existing == null) await _fiscalRepository.AddAsync(fiscalDoc);

            // 4. Map Invoice to Nuvem Fiscal Payload
            var bp = await _bpRepository.GetByIdAsync(invoice.BusinessPartnerId); // Ensure we have details if not loaded
            
            // 5. Call Provider
            try 
            {
                // Mapping is now handled inside the provider adapter
                var providerId = await _fiscalProvider.EmitirNfeAsync(fiscalDoc, invoice, bp);
                fiscalDoc.SetProviderReference(providerId);
                await _fiscalRepository.UpdateAsync(fiscalDoc);
            }
            catch (Exception ex)
            {
                fiscalDoc.Error(ex.Message);
                await _fiscalRepository.UpdateAsync(fiscalDoc);
                throw;
            }

            return fiscalDoc;
        }

        public async Task<FiscalDocument> ConsultarStatusAsync(Guid fiscalDocumentId)
        {
            var doc = await _fiscalRepository.GetByIdAsync(fiscalDocumentId);
            if (doc == null || string.IsNullOrEmpty(doc.ProviderReference)) throw new Exception("Fiscal document not found or not submitted.");

            var status = await _fiscalProvider.ConsultarNfeAsync(doc.ProviderReference);

            if (status.Status == "Authorized")
            {
                doc.Authorize(status.Protocol, "", status.PdfUrl, status.XmlUrl);
            }
            else if (status.Status == "Rejected")
            {
                doc.Reject(status.Message);
            }
            // If processing, do nothing

            await _fiscalRepository.UpdateAsync(doc);
            return doc;
        }
    }
}
