using System;
using Aurora.Domain.Common;
using Aurora.Domain.Entities.Finance;

namespace Aurora.Domain.Entities.Fiscal
{
    public class FiscalDocument : BaseEntity
    {
        public Guid InvoiceId { get; private set; }
        public Invoice Invoice { get; private set; }
        
        public string DocumentNumber { get; private set; } // NFe Number
        public string Series { get; private set; }
        public string AccessKey { get; private set; } // 44 digits key
        public FiscalDocumentStatus Status { get; private set; }
        public DateTime IssuedAt { get; private set; }
        public string XmlContent { get; private set; } // Stub for XML storage

        public FiscalDocument(Guid invoiceId, string documentNumber, string series, string accessKey)
        {
            InvoiceId = invoiceId;
            DocumentNumber = documentNumber;
            Series = series;
            AccessKey = accessKey;
            Status = FiscalDocumentStatus.Draft;
            IssuedAt = DateTime.Now;
            XmlContent = "<nfeProc>Mock XML Content</nfeProc>";
        }

        private FiscalDocument() { }

        public void Authorize()
        {
            if (Status != FiscalDocumentStatus.Draft)
                throw new InvalidOperationException("Only draft documents can be authorized.");
            Status = FiscalDocumentStatus.Authorized;
        }

        public void Cancel()
        {
            Status = FiscalDocumentStatus.Cancelled;
        }
    }

    public enum FiscalDocumentStatus
    {
        Draft,
        Authorized,
        Cancelled,
        Rejected
    }
}
