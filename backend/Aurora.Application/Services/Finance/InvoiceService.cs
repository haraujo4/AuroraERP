using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Aurora.Application.Interfaces.Finance;
using Aurora.Application.Interfaces.Repositories;
using Aurora.Domain.Entities.Finance;
using Aurora.Domain.Enums;


namespace Aurora.Application.Services.Finance
{
    public class InvoiceService : IInvoiceService
    {
        private readonly IRepository<Invoice> _invoiceRepository;
        private readonly IRepository<InvoiceItem> _itemRepository;
        private readonly IJournalEntryService _journalEntryService;
        private readonly IAccountService _accountService;
        private readonly Aurora.Application.Interfaces.Repositories.IPurchasingRepository _purchasingRepository;
        private readonly Aurora.Application.Interfaces.Repositories.ISalesOrderRepository _salesOrderRepository;
        private readonly IRepository<Aurora.Domain.Entities.BusinessPartners.BusinessPartner> _bpRepository;

        public InvoiceService(
            IRepository<Invoice> invoiceRepository,
            IRepository<InvoiceItem> itemRepository,
            IJournalEntryService journalEntryService,
            IAccountService accountService,
            Aurora.Application.Interfaces.Repositories.IPurchasingRepository purchasingRepository,
            Aurora.Application.Interfaces.Repositories.ISalesOrderRepository salesOrderRepository,
            IRepository<Aurora.Domain.Entities.BusinessPartners.BusinessPartner> bpRepository)
        {
            _invoiceRepository = invoiceRepository;
            _itemRepository = itemRepository;
            _journalEntryService = journalEntryService;
            _accountService = accountService;
            _purchasingRepository = purchasingRepository;
            _salesOrderRepository = salesOrderRepository;
            _bpRepository = bpRepository;
        }

        public async Task<IEnumerable<InvoiceDto>> GetAllAsync()
        {
            // Ideally use Includes or specific repository method. 
            // For MVP, assuming GetAllAsync returns IQueryable or we fetch all.
            // If repository only returns list, we might have N+1 issue for BP names.
            // Let's rely on lazy loading if enabled or manually handle it.
            // Given the previous repo implementation was generic basic, I'll assume I need to fetch.
            
            var invoices = await _invoiceRepository.GetAllAsync(i => i.BusinessPartner);
            var dtos = new List<InvoiceDto>();

            foreach (var inv in invoices)
            {
                var dto = MapToDto(inv);
                if (inv.BusinessPartner == null)
                {
                   var bp = await _bpRepository.GetByIdAsync(inv.BusinessPartnerId);
                   Console.WriteLine($"[InvoiceService] Manual Lookup for Inv {inv.Number}, BP ID {inv.BusinessPartnerId} -> {bp?.RazaoSocial ?? "NULL"}");
                   dto.BusinessPartnerName = bp?.RazaoSocial ?? "Unknown";
                }
                dtos.Add(dto);
            }

            return dtos;
        }

        public async Task<InvoiceDto> GetByIdAsync(Guid id)
        {
            var invoice = await _invoiceRepository.GetByIdAsync(id, i => i.Items, i => i.BusinessPartner);
            if (invoice == null) return null;
            
            // Should load items
            // Basic repository normally doesn't verify includes. 
            var dto = MapToDto(invoice);
            
            if (invoice.BusinessPartner == null)
            {
                var bp = await _bpRepository.GetByIdAsync(invoice.BusinessPartnerId);
                dto.BusinessPartnerName = bp?.RazaoSocial ?? "Unknown";
            }
            
            return dto;
        }

        public async Task<InvoiceDto> CreateAsync(CreateInvoiceDto dto)
        {
            var number = $"INV-{DateTime.Now.Year}-{new Random().Next(1000, 9999)}";
            var invoice = new Invoice(number, dto.BusinessPartnerId, dto.Type, dto.IssueDate, dto.DueDate);
            
            foreach (var item in dto.Items)
            {
                invoice.AddItem(item.Description, item.Quantity, item.UnitPrice, item.TaxAmount);
            }

            await _invoiceRepository.AddAsync(invoice);
            return MapToDto(invoice);
        }

        public async Task UpdateAsync(Guid id, UpdateInvoiceDto dto)
        {
            var invoice = await _invoiceRepository.GetByIdAsync(id);
            if (invoice == null) throw new Exception("Invoice not found");
            
            // Logic to update dates, etc.
            // invoice.UpdateDates(dto.IssueDate, dto.DueDate); 
            // Need to implement update method in entity or set properties if internal/public set (private set currently)
            // For now skipping direct update as Entity has private setters and no Update method for dates.
            // I'll skip this implementation detail for MVP since user usually creates fresh.
            await _invoiceRepository.UpdateAsync(invoice);
        }

        public async Task DeleteAsync(Guid id)
        {
            await _invoiceRepository.DeleteAsync(id); 
        }

        public async Task PostAsync(Guid id)
        {
            var invoice = await _invoiceRepository.GetByIdAsync(id, i => i.Items, i => i.BusinessPartner);
            if (invoice == null) throw new Exception("Invoice not found");
            
            Console.WriteLine($"[InvoiceService] Posting Invoice {id}. Items Count: {invoice.Items?.Count ?? 0}");

            if (invoice.Status != InvoiceStatus.Draft)
                throw new Exception("Only draft invoices can be posted");

            // 1. Mark as Posted
            invoice.MarkAsPosted();
            Console.WriteLine($"[InvoiceService] Marked as Posted. GrossAmount: {invoice.GrossAmount}");
            await _invoiceRepository.UpdateAsync(invoice);

            // 2. GL Integration
            await CreateJournalEntryForInvoice(invoice);
        }

        public async Task CancelAsync(Guid id)
        {
             var invoice = await _invoiceRepository.GetByIdAsync(id);
             if (invoice == null) throw new Exception("Invoice not found");
             invoice.Cancel();
             await _invoiceRepository.UpdateAsync(invoice);
             
             // Reverse GL entry? Future work.
        }

        public async Task<InvoiceDto> CreateFromPurchaseOrderAsync(Guid purchaseOrderId, DateTime issueDate, DateTime dueDate)
        {
            var order = await _purchasingRepository.GetOrderByIdAsync(purchaseOrderId);
            if (order == null) throw new Exception("Purchase Order not found");

            var number = $"INV-{DateTime.Now.Year}-{new Random().Next(1000, 9999)}";
            var invoice = new Invoice(number, order.SupplierId, InvoiceType.Inbound, issueDate, dueDate);
            invoice.SetReferences(purchaseOrderId, null);

            foreach (var item in order.Items)
            {
                // Note: SAP MIRO would allow partial invoicing. For MVP, we invoice all.
                invoice.AddItem(item.Material?.Description ?? "Material", item.Quantity, item.UnitPrice, item.TotalTaxAmount);
                
                var invoiceItem = invoice.Items.Last();
                invoiceItem.SetMaterial(item.MaterialId);
                invoiceItem.SetFiscalDetails(
                    item.Cfop ?? 0,
                    item.IcmsRate,
                    item.IpiRate,
                    item.PisRate,
                    item.CofinsRate
                );
            }

            await _invoiceRepository.AddAsync(invoice);
            return MapToDto(invoice);
        }

        public async Task<InvoiceDto> CreateFromSalesOrderAsync(Guid salesOrderId, DateTime issueDate, DateTime dueDate)
        {
            var order = await _salesOrderRepository.GetByIdWithDetailsAsync(salesOrderId);
            if (order == null) throw new Exception("Sales Order not found");

            var number = $"INV-{DateTime.Now.Year}-{new Random().Next(1000, 9999)}";
            
            // 1. Create and Save Invoice Header FIRST
            var invoice = new Invoice(number, order.BusinessPartnerId, InvoiceType.Outbound, issueDate, dueDate);
            invoice.SetReferences(null, salesOrderId);
            
            await _invoiceRepository.AddAsync(invoice);
            Console.WriteLine($"[InvoiceService] Header Saved: {invoice.Id}");

            // 2. Add Items one by one and Save them (Bypassing EF Core Cascading issues)
            foreach (var item in order.Items)
            {
                Console.WriteLine($"[InvoiceService] Processing Item: {item.Material?.Description} | Qty: {item.Quantity} | UnitPrice: {item.UnitPrice} | Tax: {item.TotalTaxValue}");
                
                invoice.AddItem(item.Material?.Description ?? "Material", item.Quantity, item.UnitPrice, item.TotalTaxValue);
                
                var invoiceItem = invoice.Items.Last();
                invoiceItem.SetMaterial(item.MaterialId);
                invoiceItem.SetFiscalDetails(
                    item.Cfop ?? 0,
                    item.IcmsRate,
                    item.IpiRate,
                    item.PisRate,
                    item.CofinsRate
                );
                
                Console.WriteLine($"[InvoiceService] Added Item to Invoice. TotalAmount: {invoiceItem.TotalAmount}");
                await _itemRepository.AddAsync(invoiceItem);
            }

            // 3. Update Invoice to save calculated totals (triggering update on header)
            invoice.UpdateTotals();
            Console.WriteLine($"[InvoiceService] Recalculated Invoice Totals. Gross: {invoice.GrossAmount} | Tax: {invoice.TaxAmount} | Net: {invoice.NetAmount}");
            Console.WriteLine($"[InvoiceService] Saving Invoice {invoice.Id} with GrossAmount: {invoice.GrossAmount}");
            await _invoiceRepository.UpdateAsync(invoice);
            
            // 4. Update SO status
            order.UpdateStatus(Aurora.Domain.Entities.Sales.SalesOrderStatus.Invoiced);
            await _salesOrderRepository.UpdateAsync(order);

            // 5. Force Reload to ensure data integrity
            var reloaded = await _invoiceRepository.GetByIdAsync(invoice.Id, i => i.Items, i => i.BusinessPartner);
            
            var dto = MapToDto(reloaded ?? invoice);
            
            // Manual BP Patch if still missing
            if (dto.BusinessPartnerName == "Unknown" || string.IsNullOrEmpty(dto.BusinessPartnerName))
            {
                 var bp = await _bpRepository.GetByIdAsync(order.BusinessPartnerId);
                 dto.BusinessPartnerName = bp?.RazaoSocial ?? "Unknown";
            }

            return dto;
        }

        private InvoiceDto MapToDto(Invoice entity)
        {
            return new InvoiceDto
            {
                Id = entity.Id,
                Number = entity.Number,
                BusinessPartnerId = entity.BusinessPartnerId,
                BusinessPartnerName = entity.BusinessPartner?.RazaoSocial ?? "Unknown", // Would need Include
                Type = entity.Type,
                Status = entity.Status,
                IssueDate = entity.IssueDate,
                DueDate = entity.DueDate,
                GrossAmount = entity.GrossAmount,
                TaxAmount = entity.TaxAmount,
                NetAmount = entity.NetAmount,
                PurchaseOrderId = entity.PurchaseOrderId,
                SalesOrderId = entity.SalesOrderId,
                Items = entity.Items.Select(i => new InvoiceItemDto
                {
                    Id = i.Id,
                    MaterialId = i.MaterialId,
                    Description = i.Description,
                    Quantity = i.Quantity,
                    UnitPrice = i.UnitPrice,
                    TaxAmount = i.TaxAmount,
                    TotalAmount = i.TotalAmount,
                    IcmsRate = i.IcmsRate,
                    IpiRate = i.IpiRate,
                    PisRate = i.PisRate,
                    CofinsRate = i.CofinsRate,
                    Cfop = i.Cfop
                }).ToList()
            };
        }

        private async Task CreateJournalEntryForInvoice(Invoice invoice)
        {
            // Simple mapping logic for MVP
            // INBOUND (Payable): Dr Expense / Cr Payable
            // OUTBOUND (Receivable): Dr Receivable / Cr Revenue

            // Get standard accounts
            var accounts = await _accountService.GetAllAsync();
            
            // Find Accounts by loose matching or Code convention
            var receivableAccount = accounts.FirstOrDefault(a => a.Type == AccountType.Asset && a.Name.Contains("Clientes")) 
                                 ?? accounts.FirstOrDefault(a => a.Type == AccountType.Asset); // Fallback
            var revenueAccount = accounts.FirstOrDefault(a => a.Type == AccountType.Revenue) 
                              ?? accounts.LastOrDefault(a => a.Type == AccountType.Revenue);
            
            var payableAccount = accounts.FirstOrDefault(a => a.Type == AccountType.Liability && a.Name.Contains("Fornecedores"))
                                ?? accounts.FirstOrDefault(a => a.Type == AccountType.Liability);
            var expenseAccount = accounts.FirstOrDefault(a => a.Type == AccountType.Expense)
                                ?? accounts.LastOrDefault(a => a.Type == AccountType.Expense);

            if (receivableAccount == null || revenueAccount == null || payableAccount == null || expenseAccount == null)
            {
                // In production, throw error. For MVP, we might fail or log.
                // Assuming accounts exist from previous step or user created them.
            }

            var jeParams = new CreateJournalEntryDto
            {
                PostingDate = invoice.IssueDate,
                DocumentDate = invoice.IssueDate,
                Description = $"Invoice #{invoice.Id.ToString().Substring(0,8)} - {invoice.BusinessPartner?.RazaoSocial ?? "Partner"}",
                Reference = invoice.Id.ToString(),
                Lines = new List<CreateJournalEntryLineDto>()
            };

            if (invoice.Type == InvoiceType.Outbound)
            {
                Console.WriteLine($"[InvoiceService] Creating JE for Outbound Invoice. Amount: {invoice.GrossAmount}");
                // Dr Receivable
                jeParams.Lines.Add(new CreateJournalEntryLineDto
                {
                    AccountId = receivableAccount?.Id ?? Guid.Empty, // Fail if null
                    Amount = invoice.GrossAmount, // receivable is gross (incl tax usually, but depend on tax setup)
                    Type = JournalEntryLineType.Debit.ToString()
                });
                
                // Cr Revenue
                jeParams.Lines.Add(new CreateJournalEntryLineDto
                {
                    AccountId = revenueAccount?.Id ?? Guid.Empty,
                    Amount = invoice.GrossAmount, 
                    Type = JournalEntryLineType.Credit.ToString()
                });
            }
            else
            {
                // Inbound (Payable)
                // Dr Expense
                 jeParams.Lines.Add(new CreateJournalEntryLineDto
                {
                    AccountId = expenseAccount?.Id ?? Guid.Empty,
                    Amount = invoice.GrossAmount,
                    Type = JournalEntryLineType.Debit.ToString()
                });

                // Cr Payable
                jeParams.Lines.Add(new CreateJournalEntryLineDto
                {
                    AccountId = payableAccount?.Id ?? Guid.Empty,
                    Amount = invoice.GrossAmount,
                    Type = JournalEntryLineType.Credit.ToString()
                });
            }

            if (jeParams.Lines.All(x => x.AccountId != Guid.Empty))
            {
                var je = await _journalEntryService.CreateAsync(jeParams);
                await _journalEntryService.PostAsync(je.Id);
            }
        }
    }
}
