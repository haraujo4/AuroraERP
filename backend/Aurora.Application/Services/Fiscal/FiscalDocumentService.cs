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
        private readonly IRepository<Invoice> _invoiceRepository;

        public FiscalDocumentService(
            IRepository<FiscalDocument> repository,
            IRepository<Invoice> invoiceRepository)
        {
            _repository = repository;
            _invoiceRepository = invoiceRepository;
        }

        public async Task<FiscalDocumentDto> GenerateFromInvoiceAsync(Guid invoiceId)
        {
            var invoice = await _invoiceRepository.GetByIdAsync(invoiceId);
            if (invoice == null) throw new Exception("Invoice not found");
            if (invoice.Status != Aurora.Domain.Enums.InvoiceStatus.Posted)
                throw new Exception("Invoice must be Posted to generate NFe");

            // Check if already exists
            var existing = (await _repository.FindAsync(f => f.InvoiceId == invoiceId)).FirstOrDefault();
            if (existing != null) return MapToDto(existing);

            // Generate Mock NFe
            var random = new Random();
            var docNumber = random.Next(1000, 999999).ToString();
            var series = "1";
            var accessKey = string.Join("", Enumerable.Range(0, 44).Select(_ => random.Next(0, 10).ToString()));

            var doc = new FiscalDocument(invoiceId, docNumber, series, accessKey);
            
            // Mock implicit authorization for MVP
            doc.Authorize("MOCK-PROTOCOL", "<nfe>Mock</nfe>", "http://mock-url.com/danfe.pdf", "http://mock-url.com/nfe.xml");

            await _repository.AddAsync(doc);
            return MapToDto(doc);
        }

        public async Task<FiscalDocumentDto> GetByInvoiceIdAsync(Guid invoiceId)
        {
            var doc = (await _repository.FindAsync(f => f.InvoiceId == invoiceId)).FirstOrDefault();
            return doc != null ? MapToDto(doc) : null;
        }

        public async Task<IEnumerable<FiscalDocumentDto>> GetAllAsync()
        {
            var docs = await _repository.GetAllAsync();
            return docs.Select(MapToDto);
        }

        public async Task CancelAsync(Guid id)
        {
            var doc = await _repository.GetByIdAsync(id);
            if (doc == null) throw new Exception("Document not found");
            doc.Cancel();
            await _repository.UpdateAsync(doc);
        }

        private FiscalDocumentDto MapToDto(FiscalDocument entity)
        {
            return new FiscalDocumentDto
            {
                Id = entity.Id,
                InvoiceId = entity.InvoiceId,
                DocumentNumber = entity.DocumentNumber,
                Series = entity.Series,
                AccessKey = entity.AccessKey,
                Status = entity.Status.ToString(),
                IssuedAt = entity.IssuedAt
            };
        }
    }
}
