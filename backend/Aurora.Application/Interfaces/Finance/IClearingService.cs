using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Aurora.Application.Interfaces.Finance
{
    public interface IClearingService
    {
        Task<List<OpenItemDto>> GetOpenItemsAsync(Guid partnerId);
        Task ClearManualAsync(ManualClearingRequest request);
    }

    public class OpenItemDto
    {
        public Guid LineId { get; set; }
        public Guid JournalEntryId { get; set; }
        public Guid BusinessPartnerId { get; set; }
        public string Description { get; set; }
        public DateTime PostingDate { get; set; }
        public string Reference { get; set; }
        public decimal Amount { get; set; }
        public string Type { get; set; } // Debit/Credit
        public string JournalEntryType { get; set; }
        public string AccountName { get; set; }
    }

    public class ManualClearingRequest
    {
        public List<Guid> LineIds { get; set; } = new();
    }
}
