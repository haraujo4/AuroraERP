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
    public class PaymentService : IPaymentService
    {
        private readonly IRepository<Payment> _paymentRepository;
        private readonly IRepository<Invoice> _invoiceRepository;
        private readonly IJournalEntryService _journalEntryService;
        private readonly IAccountService _accountService;

        public PaymentService(
            IRepository<Payment> paymentRepository,
            IRepository<Invoice> invoiceRepository,
            IJournalEntryService journalEntryService,
            IAccountService accountService)
        {
            _paymentRepository = paymentRepository;
            _invoiceRepository = invoiceRepository;
            _journalEntryService = journalEntryService;
            _accountService = accountService;
        }

        public async Task<IEnumerable<PaymentDto>> GetAllAsync()
        {
            var payments = await _paymentRepository.GetAllAsync();
            return payments.Select(MapToDto);
        }

        public async Task<PaymentDto> GetByIdAsync(Guid id)
        {
            var payment = await _paymentRepository.GetByIdAsync(id);
            if (payment == null) return null;
            return MapToDto(payment);
        }

        public async Task<PaymentDto> CreateAsync(CreatePaymentDto dto)
        {
            if (!Enum.TryParse<PaymentMethod>(dto.Method, out var method))
                throw new Exception("Invalid Payment Method");

            var payment = new Payment(
                dto.BusinessPartnerId,
                dto.Amount,
                dto.PaymentDate,
                method,
                dto.AccountId,
                dto.Reference ?? "",
                dto.InvoiceId);

            await _paymentRepository.AddAsync(payment);
            return MapToDto(payment);
        }

        public async Task PostAsync(Guid id)
        {
            var payment = await _paymentRepository.GetByIdAsync(id);
            if (payment == null) throw new Exception("Payment not found");

            payment. MarkAsPosted();
            await _paymentRepository.UpdateAsync(payment);

            // GL Integration
            await CreateJournalEntryForPayment(payment);

            // Update Invoice Status if linked
            if (payment.InvoiceId.HasValue)
            {
                var invoice = await _invoiceRepository.GetByIdAsync(payment.InvoiceId.Value);
                if (invoice != null)
                {
                    invoice.MarkAsPaid();
                    await _invoiceRepository.UpdateAsync(invoice);
                }
            }
        }

        public async Task CancelAsync(Guid id)
        {
            var payment = await _paymentRepository.GetByIdAsync(id);
            if (payment == null) throw new Exception("Payment not found");

            payment.Cancel();
            await _paymentRepository.UpdateAsync(payment);
        }

        private async Task CreateJournalEntryForPayment(Payment payment)
        {
            var accounts = await _accountService.GetAllAsync();
            
            // 1. Bank/Cash Account (the one selected in payment)
            var bankAccount = accounts.FirstOrDefault(a => a.Id == payment.AccountId);

            // 2. Control Account (Payable/Receivable)
            AccountDto controlAccount = null;
            JournalEntryLineType bankLineType;
            JournalEntryLineType controlLineType;

            if (payment.InvoiceId.HasValue)
            {
                var invoice = await _invoiceRepository.GetByIdAsync(payment.InvoiceId.Value);
                if (invoice.Type == InvoiceType.Inbound) // Paying a vendor
                {
                    // Dr Payable / Cr Bank
                    controlAccount = accounts.FirstOrDefault(a => a.Type == AccountType.Liability && a.Name.Contains("Fornecedores"));
                    bankLineType = JournalEntryLineType.Credit;
                    controlLineType = JournalEntryLineType.Debit;
                }
                else // Receiving from a customer
                {
                    // Dr Bank / Cr Receivable
                    controlAccount = accounts.FirstOrDefault(a => a.Type == AccountType.Asset && a.Name.Contains("Clientes"));
                    bankLineType = JournalEntryLineType.Debit;
                    controlLineType = JournalEntryLineType.Credit;
                }
            }
            else
            {
                // Unlinked payment (Advance or Misc)
                // For MVP, just use basic setup or skip
                return;
            }

            if (bankAccount == null || controlAccount == null) return;

            var jeParams = new CreateJournalEntryDto
            {
                PostingDate = payment.PaymentDate,
                DocumentDate = payment.PaymentDate,
                Description = $"Payment #{payment.Id.ToString().Substring(0,8)} - Ref: {payment.Reference}",
                Reference = payment.Id.ToString(),
                Lines = new List<CreateJournalEntryLineDto>
                {
                    new CreateJournalEntryLineDto
                    {
                        AccountId = bankAccount.Id,
                        Amount = payment.Amount,
                        Type = bankLineType.ToString()
                    },
                    new CreateJournalEntryLineDto
                    {
                        AccountId = controlAccount.Id,
                        Amount = payment.Amount,
                        Type = controlLineType.ToString()
                    }
                }
            };

            var je = await _journalEntryService.CreateAsync(jeParams);
            await _journalEntryService.PostAsync(je.Id);
        }

        private PaymentDto MapToDto(Payment entity)
        {
            return new PaymentDto
            {
                Id = entity.Id,
                BusinessPartnerId = entity.BusinessPartnerId,
                BusinessPartnerName = entity.BusinessPartner?.RazaoSocial ?? "Unknown",
                InvoiceId = entity.InvoiceId,
                Amount = entity.Amount,
                PaymentDate = entity.PaymentDate,
                Method = entity.Method.ToString(),
                AccountId = entity.AccountId,
                Status = entity.Status.ToString(),
                Reference = entity.Reference
            };
        }
    }
}
