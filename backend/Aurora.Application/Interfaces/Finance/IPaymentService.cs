using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Aurora.Domain.Enums;

namespace Aurora.Application.Interfaces.Finance
{
    public interface IPaymentService
    {
        Task<IEnumerable<PaymentDto>> GetAllAsync();
        Task<PaymentDto> GetByIdAsync(Guid id);
        Task<PaymentDto> CreateAsync(CreatePaymentDto dto);
        Task PostAsync(Guid id);
        Task CancelAsync(Guid id);
    }

    public class PaymentDto
    {
        public Guid Id { get; set; }
        public Guid BusinessPartnerId { get; set; }
        public string BusinessPartnerName { get; set; }
        public Guid? InvoiceId { get; set; }
        public decimal Amount { get; set; }
        public DateTime PaymentDate { get; set; }
        public string Method { get; set; }
        public Guid AccountId { get; set; }
        public string Status { get; set; }
        public string Reference { get; set; }
    }

    public class CreatePaymentDto
    {
        public Guid BusinessPartnerId { get; set; }
        public decimal Amount { get; set; }
        public DateTime PaymentDate { get; set; }
        public string Method { get; set; }
        public Guid AccountId { get; set; }
        public string Reference { get; set; }
        public Guid? InvoiceId { get; set; }
    }
}
