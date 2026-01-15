using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Aurora.Application.Interfaces.Finance
{
    public interface IJournalEntryService
    {
        Task<JournalEntryDto> CreateAsync(CreateJournalEntryDto dto);
        Task<JournalEntryDto> GetByIdAsync(Guid id);
        Task<IEnumerable<JournalEntryDto>> GetAllAsync();
        Task PostAsync(Guid id);
        Task CancelAsync(Guid id);
        Task ReverseAsync(Guid id, string reason);
        Task<JournalEntryDto> GetByReferenceAsync(string reference);
    }

    public class JournalEntryDto
    {
        public Guid Id { get; set; }
        public DateTime PostingDate { get; set; }
        public DateTime DocumentDate { get; set; }
        public string Description { get; set; }
        public string? Reference { get; set; }
        public string Status { get; set; }
        public string Type { get; set; }
        public List<JournalEntryLineDto> Lines { get; set; } = new();
    }

    public class JournalEntryLineDto
    {
        public Guid AccountId { get; set; }
        public string AccountName { get; set; }
        public Guid? BusinessPartnerId { get; set; }
        public string? BusinessPartnerName { get; set; }
        public decimal Amount { get; set; }
        public string Type { get; set; }
        public Guid? CostCenterId { get; set; }
        public Guid? ClearingId { get; set; }
        public DateTime? ClearedAt { get; set; }
        public bool IsCleared { get; set; }
    }

    public class CreateJournalEntryDto
    {
        public DateTime PostingDate { get; set; }
        public DateTime DocumentDate { get; set; }
        public string Description { get; set; }
        public string? Reference { get; set; }
        public string? Type { get; set; }
        public List<CreateJournalEntryLineDto> Lines { get; set; } = new();
    }

    public class CreateJournalEntryLineDto
    {
        public Guid AccountId { get; set; }
        public decimal Amount { get; set; }
        public string Type { get; set; } // "Debit" or "Credit"
        public Guid? CostCenterId { get; set; }
        public Guid? BusinessPartnerId { get; set; }
    }
}
