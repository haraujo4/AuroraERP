using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Aurora.Application.Interfaces.Fiscal;
using Aurora.Application.Interfaces.Repositories;
using Aurora.Domain.Entities.Finance;
using Aurora.Domain.Entities.Fiscal;

namespace Aurora.Application.Services.Fiscal
{
    public class FiscalDocumentService : IFiscalDocumentService
    {
        private readonly IRepository<FiscalDocument> _repository;
        private readonly IFiscalService _fiscalService;

        public FiscalDocumentService(
            IRepository<FiscalDocument> repository,
            IFiscalService fiscalService)
        {
            _repository = repository;
            _fiscalService = fiscalService;
        }

        public async Task<FiscalDocumentDto> GenerateFromInvoiceAsync(Guid invoiceId)
        {
            // Delegate logic to Fiscal Service (which handles Provider and Email)
            var doc = await _fiscalService.EmitirNotaFiscalAsync(invoiceId);
            return MapToDto(doc);
        }

        public async Task<FiscalDocumentDto> GetByInvoiceIdAsync(Guid invoiceId)
        {
            var doc = (await _repository.FindAsync(f => f.InvoiceId == invoiceId)).FirstOrDefault();
            return doc != null ? MapToDto(doc) : null;
        }

        public async Task<IEnumerable<FiscalDocumentDto>> GetAllAsync()
        {
            var docs = await _repository.GetAllAsync(d => d.Invoice, d => d.Invoice.BusinessPartner);
            return docs.Select(MapToDto);
        }

        public async Task CancelAsync(Guid id)
        {
            var doc = await _repository.GetByIdAsync(id);
            if (doc == null) throw new Exception("Document not found");
            doc.Cancel();
            await _repository.UpdateAsync(doc);
        }

        public async Task<byte[]> GetPdfBytesByInvoiceIdAsync(Guid invoiceId)
        {
            return await _fiscalService.GetPdfBytesAsync(invoiceId);
        }

        private FiscalDocumentDto MapToDto(FiscalDocument entity)
        {
            return new FiscalDocumentDto
            {
                Id = entity.Id,
                InvoiceId = entity.InvoiceId,
                InvoiceNumber = entity.Invoice?.Number,
                DocumentNumber = entity.DocumentNumber,
                Series = entity.Series,
                AccessKey = entity.AccessKey,
                Status = entity.Status.ToString(),
                IssuedAt = entity.IssuedAt,
                PartnerName = entity.Invoice?.BusinessPartner?.RazaoSocial ?? "N/A",
                Amount = entity.Invoice?.GrossAmount ?? 0
            };
        }
    }
}
