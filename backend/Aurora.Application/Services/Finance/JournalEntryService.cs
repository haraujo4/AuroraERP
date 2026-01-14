using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Aurora.Application.Interfaces.Finance;
using Aurora.Application.Interfaces.Repositories;
using Aurora.Domain.Entities.Finance;

namespace Aurora.Application.Services.Finance
{
    public class JournalEntryService : IJournalEntryService
    {
        private readonly IRepository<JournalEntry> _entryRepo;
        private readonly IRepository<Account> _accountRepo;

        public JournalEntryService(IRepository<JournalEntry> entryRepo, IRepository<Account> accountRepo)
        {
            _entryRepo = entryRepo;
            _accountRepo = accountRepo;
        }

        public async Task<JournalEntryDto> CreateAsync(CreateJournalEntryDto dto)
        {
            var entry = new JournalEntry(dto.PostingDate, dto.DocumentDate, dto.Description, dto.Reference);
            
            foreach (var line in dto.Lines)
            {
                var type = Enum.Parse<JournalEntryLineType>(line.Type);
                entry.AddLine(line.AccountId, line.Amount, type, line.CostCenterId);
            }

            await _entryRepo.AddAsync(entry);
            return await GetByIdAsync(entry.Id);
        }

        public async Task<JournalEntryDto> GetByIdAsync(Guid id)
        {
            var entry = await _entryRepo.GetByIdAsync(id, x => x.Lines);
            if (entry == null) throw new Exception("Journal Entry not found");

            var accounts = await LoadAccountsForEntries(new[] { entry });
            return MapToDto(entry, accounts);
        }

        public async Task<IEnumerable<JournalEntryDto>> GetAllAsync()
        {
            var entries = await _entryRepo.GetAllAsync(e => e.Lines);
            var accounts = await LoadAccountsForEntries(entries);
            return entries.Select(e => MapToDto(e, accounts));
        }

        public async Task PostAsync(Guid id)
        {
            var entry = await _entryRepo.GetByIdAsync(id);
            if (entry == null) throw new Exception("Journal Entry not found");

            entry.Post();
            await _entryRepo.UpdateAsync(entry);
        }

        private async Task<Dictionary<Guid, Account>> LoadAccountsForEntries(IEnumerable<JournalEntry> entries)
        {
            var accountIds = entries.SelectMany(e => e.Lines).Select(l => l.AccountId).Distinct().ToList();
            if (accountIds.Any())
            {
                var accounts = await _accountRepo.FindAsync(a => accountIds.Contains(a.Id));
                return accounts.ToDictionary(a => a.Id);
            }
            return new Dictionary<Guid, Account>();
        }

        private JournalEntryDto MapToDto(JournalEntry entry, Dictionary<Guid, Account> accountLookup = null)
        {
            return new JournalEntryDto
            {
                Id = entry.Id,
                PostingDate = entry.PostingDate,
                DocumentDate = entry.DocumentDate,
                Description = entry.Description,
                Reference = entry.Reference,
                Status = entry.Status.ToString(),
                Lines = entry.Lines.Select(l => 
                {
                    string accountName = "N/A";
                    if (l.Account != null) accountName = l.Account.Name;
                    else if (accountLookup != null && accountLookup.TryGetValue(l.AccountId, out var acc)) accountName = acc.Name;

                    return new JournalEntryLineDto
                    {
                        AccountId = l.AccountId,
                        AccountName = accountName,
                        Amount = l.Amount,
                        Type = l.Type.ToString(),
                        CostCenterId = l.CostCenterId
                    };
                }).ToList()
            };
        }
    }
}
