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
        
        // Integration Fields
        public string? ProviderReference { get; private set; } // ID in Nuvem Fiscal
        public string? Protocol { get; private set; }
        public string? AuthorizationUrl { get; private set; } // PDF/DANFE
        public string? XmlUrl { get; private set; }
        public string? ErrorMessage { get; private set; }

        public FiscalDocument(Guid invoiceId, string documentNumber, string series, string accessKey)
        {
            InvoiceId = invoiceId;
            DocumentNumber = documentNumber;
            Series = series;
            AccessKey = accessKey;
            Status = FiscalDocumentStatus.Draft;
            IssuedAt = DateTime.Now;
            XmlContent = "";
        }

        private FiscalDocument() { }

        public void SetProviderReference(string reference)
        {
            ProviderReference = reference;
            Status = FiscalDocumentStatus.Processing;
        }

        public void Authorize(string protocol, string xmlContent, string authUrl, string xmlUrl)
        {
            Status = FiscalDocumentStatus.Authorized;
            Protocol = protocol;
            XmlContent = xmlContent;
            AuthorizationUrl = authUrl;
            XmlUrl = xmlUrl;
            ErrorMessage = null;
        }

        public void Reject(string errorMessage)
        {
            Status = FiscalDocumentStatus.Rejected;
            ErrorMessage = errorMessage;
        }

        public void Cancel()
        {
            Status = FiscalDocumentStatus.Cancelled;
        }
        
        public void Error(string error)
        {
             Status = FiscalDocumentStatus.Error;
             ErrorMessage = error;
        }
    }

    public enum FiscalDocumentStatus
    {
        Draft,
        Processing,
        Authorized,
        Cancelled,
        Rejected,
        Error
    }
}
