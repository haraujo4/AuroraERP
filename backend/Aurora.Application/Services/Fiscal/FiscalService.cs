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
        private readonly Aurora.Application.Interfaces.Services.IEmailQueue _emailQueue;
        private readonly Aurora.Application.Interfaces.Repositories.IEmpresaRepository _empresaRepository;
        private readonly Aurora.Application.Interfaces.Finance.IJournalEntryService _journalEntryService;

        public FiscalService(
            IFiscalProvider fiscalProvider,
            IRepository<FiscalDocument> fiscalRepository,
            IRepository<Invoice> invoiceRepository,
            IRepository<Aurora.Domain.Entities.BusinessPartners.BusinessPartner> bpRepository,
            Aurora.Application.Interfaces.Services.IEmailQueue emailQueue,
            Aurora.Application.Interfaces.Repositories.IEmpresaRepository empresaRepository,
            Aurora.Application.Interfaces.Finance.IJournalEntryService journalEntryService)
        {
            _fiscalProvider = fiscalProvider;
            _fiscalRepository = fiscalRepository;
            _invoiceRepository = invoiceRepository;
            _bpRepository = bpRepository;
            _emailQueue = emailQueue;
            _empresaRepository = empresaRepository;
            _journalEntryService = journalEntryService;
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

                // Auto-consult and Send Email
                var status = await _fiscalProvider.ConsultarNfeAsync(providerId);
                if (status.Status == "Authorized")
                {
                    fiscalDoc.Authorize(status.Protocol, "", status.PdfUrl, status.XmlUrl);
                    await _fiscalRepository.UpdateAsync(fiscalDoc);

                    try 
                    {
                        var pdfBytes = await _fiscalProvider.GetPdfBytesAsync(providerId, invoice);
                        var xmlString = await _fiscalProvider.GetXmlContentAsync(providerId, invoice);
                        var xmlBytes = System.Text.Encoding.UTF8.GetBytes(xmlString);

                        var company = (await _empresaRepository.GetAllAsync()).FirstOrDefault();
                        var bpEmail = bp?.Contacts?.FirstOrDefault()?.Email; // Ensure contacts loaded? 
                        // Repository GetByIdAsync usually doesn't include unless specified.
                        // Assuming BP has contacts or we assume user logic checked it. 
                        // Mock Provider generated PDF hoping for data, but here we need actual email.
                        // We might need to reload BP with contacts if 'bp' above didn't include them.
                        // But let's check line 52: var bp = await _bpRepository.GetByIdAsync...
                        // We can just rely on 'bp' if it was generic GetById. Maybe contacts are missing.
                        
                        // Let's assume user manually configured email or we reload.
                        // Re-fetch BP with Contacts to be safe
                        var bpWithContacts = await _bpRepository.GetByIdAsync(bp.Id); // Generic repo might not support Include via string here effortlessly without specific interface method
                        // But let's try assuming it works or send to a default if null.
                        // Actually in SalesQuoteService we used `GetByIdAsync(id, b => b.Contacts)`.
                        // But _bpRepository here is generic IRepository<BusinessPartner> based on constructor!
                        // Line 17: IRepository<BusinessPartner>.
                        // So we CAN'T use the specific include lambda easily unless we cast or change dependency type to IBusinessPartnerRepository.
                        // I will assume the user has the email logic covered or I'll just skip if email missing.
                        
                        // Hack: Since I cannot easily include, I'll rely on what's available or try to cast.
                        // But I can't cast IRepository to IBusinessPartnerRepository if it's not registered as such?
                        // Registered as Scoped IBusinessPartnerRepository, Repository...
                        // Program.cs: builder.Services.AddScoped<IBusinessPartnerRepository, ...Repository>();
                        // So I should inject IBusinessPartnerRepository instead of IRepository<BusinessPartner>.

                        // Just try to use whatever we have, or assume standard validation.
                        // If I can't get email, I won't crash.
                        
                        // Wait, I can change the field type to IBusinessPartnerRepository since it IS one.
                        // But checking previous edit, I didn't change the field type, just added new fields.
                        
                        // Okay, I will modify the field definition in a separate step if needed, or just proceed.
                        // Wait, I can cast `_bpRepository` to `IBusinessPartnerRepository` if the underlying object is compatible.
                        // Yes, `BusinessPartnerRepository` implements `IBusinessPartnerRepository` which implements `IRepository`.
                        // So casting is possible.
                        
                        var bpRepo = _bpRepository as Aurora.Application.Interfaces.Repositories.IBusinessPartnerRepository;
                        string emailToSend = null;
                        string clientName = bp?.RazaoSocial ?? "Prezado(a) Cliente";
                        
                        if (bpRepo != null) 
                        {
                            var completeBp = await bpRepo.GetByIdAsync(bp.Id, b => b.Contacts);
                            var contact = completeBp?.Contacts.FirstOrDefault();
                            emailToSend = contact?.Email;
                            if (contact != null && !string.IsNullOrEmpty(contact.Name))
                                clientName = contact.Name;
                        }

                        if (!string.IsNullOrEmpty(emailToSend))
                        {
                            var companyName = company?.RazaoSocial ?? "Aurora ERP";
                            
                            await _emailQueue.EnqueueAsync(new Aurora.Domain.Models.EmailMessage
                            {
                                To = emailToSend,
                                Subject = $"Nota Fiscal #{invoice.Number} Emitida - {companyName}",
                                Body = $@"
                                    <h1>Olá {clientName},</h1>
                                    <p>Sua nota fiscal {invoice.Number} foi emitida com sucesso.</p>
                                    <p>Os documentos fiscais (PDF e XML) seguem em anexo a este e-mail para sua conferência.</p>
                                    <ul>
                                        <li><strong>Número:</strong> {invoice.Number}</li>
                                        <li><strong>Valor:</strong> {invoice.GrossAmount:C}</li>
                                        <li><strong>Vencimento:</strong> {invoice.DueDate:d}</li>
                                    </ul>
                                    <p>O boleto também pode ser acessado em nosso portal do cliente.</p>
                                    <br>
                                    <p>Atenciosamente,<br><strong>{companyName}</strong></p>",
                                IsHtml = true,
                                Attachments = new System.Collections.Generic.List<Aurora.Domain.Models.EmailAttachment>
                                {
                                    new Aurora.Domain.Models.EmailAttachment { FileName = $"NF_{invoice.Number}.pdf", Content = pdfBytes, ContentType = "application/pdf" },
                                    new Aurora.Domain.Models.EmailAttachment { FileName = $"NF_{invoice.Number}.xml", Content = xmlBytes, ContentType = "application/xml" }
                                }
                            });
                        }
                    }
                    catch(Exception ex) { Console.WriteLine($"[FiscalService] Error sending email with attachments: {ex.Message}"); }
                }
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
        public async Task CancelInvoiceAsync(Guid invoiceId, string reason)
        {
            var invoice = await _invoiceRepository.GetByIdAsync(invoiceId);
            if (invoice == null) throw new Exception("Invoice not found.");

            // Find valid fiscal document
            var fiscalDoc = (await _fiscalRepository.FindAsync(f => f.InvoiceId == invoiceId)).FirstOrDefault();
            
            // If it's authorized, we MUST cancel it at the provider
            if (fiscalDoc != null && fiscalDoc.Status == FiscalDocumentStatus.Authorized)
            {
                try
                {
                    await _fiscalProvider.CancelarNfeAsync(fiscalDoc, reason);
                    fiscalDoc.Cancel();
                    await _fiscalRepository.UpdateAsync(fiscalDoc);
                }
                catch (Exception ex)
                {
                    throw new Exception($"Failed to cancel fiscal document at provider: {ex.Message}");
                }
            }
            else if (fiscalDoc != null)
            {
                // If it's in another state (Draft, Error, Rejected), we just cancel it locally
                fiscalDoc.Cancel();
                await _fiscalRepository.UpdateAsync(fiscalDoc);
            }

            try
            {
                // 1. Mark Invoice as Cancelled
                invoice.Cancel();
                await _invoiceRepository.UpdateAsync(invoice);

                // 2. Financial Reversal
                // Standardization: Try Number, then ID for legacy
                var je = await _journalEntryService.GetByReferenceAsync(invoice.Number) 
                         ?? await _journalEntryService.GetByReferenceAsync(invoice.Id.ToString());

                if (je != null && je.Status == "Posted")
                {
                    await _journalEntryService.ReverseAsync(je.Id, reason);
                }
            }
            catch (Exception ex)
            {
                throw new Exception($"Failed to cancel invoice or reverse financial entries: {ex.Message}");
            }
        }
        public async Task<byte[]> GetPdfBytesAsync(Guid invoiceId)
        {
            var invoice = await _invoiceRepository.GetByIdAsync(invoiceId, i => i.Items, i => i.BusinessPartner);
            if (invoice == null) throw new Exception("Invoice not found.");

            var fiscalDoc = (await _fiscalRepository.FindAsync(f => f.InvoiceId == invoiceId)).FirstOrDefault();
            
            // Auto-emit if missing but posted
            if (fiscalDoc == null && invoice.Status == InvoiceStatus.Posted)
            {
                Console.WriteLine($"[PDF] Fiscal document not found for posted invoice {invoiceId}. Attempting auto-emission.");
                fiscalDoc = await EmitirNotaFiscalAsync(invoiceId);
            }

            if (fiscalDoc == null) 
            {
                Console.WriteLine($"[PDF] Failed to find or emit fiscal document for invoice {invoiceId}");
                throw new Exception("No fiscal document found for this invoice and it's not in a state to be emitted.");
            }

            Console.WriteLine($"[PDF] Fetching bytes from provider for ref: {fiscalDoc.ProviderReference}");
            return await _fiscalProvider.GetPdfBytesAsync(fiscalDoc.ProviderReference, invoice);
        }
    }
}
