using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Aurora.Application.Interfaces.Finance;
using Aurora.Application.Interfaces.Repositories;
using Aurora.Domain.Entities.Finance;

namespace Aurora.Application.Services.Finance
{
    public class ClearingService : IClearingService
    {
        private readonly IRepository<JournalEntry> _entryRepo;
        private readonly IRepository<JournalEntryLine> _lineRepo;

        public ClearingService(IRepository<JournalEntry> entryRepo, IRepository<JournalEntryLine> lineRepo)
        {
            _entryRepo = entryRepo;
            _lineRepo = lineRepo;
        }

        public async Task<List<OpenItemDto>> GetOpenItemsAsync(Guid partnerId)
        {
            // Fetch only POSTED lines that are not cleared for this partner
            var lines = await _lineRepo.FindAsync(
                l => l.BusinessPartnerId == partnerId && l.ClearingId == null && l.JournalEntry.Status == JournalEntryStatus.Posted,
                l => l.JournalEntry,
                l => l.Account);
            
            var openItems = lines
                .Select(l => new OpenItemDto
                {
                    LineId = l.Id,
                    JournalEntryId = l.JournalEntryId,
                    BusinessPartnerId = l.BusinessPartnerId ?? Guid.Empty,
                    Description = l.JournalEntry?.Description ?? "Lançamento Contábil",
                    PostingDate = l.JournalEntry?.PostingDate ?? DateTime.MinValue,
                    Reference = l.JournalEntry?.Reference ?? "",
                    Amount = l.Amount,
                    Type = l.Type.ToString(),
                    JournalEntryType = l.JournalEntry?.Type.ToString() ?? "Standard",
                    AccountName = l.Account?.Name ?? "Conta Contábil"
                })
                .OrderBy(l => l.PostingDate)
                .ToList();

            return openItems;
        }

        public async Task ClearManualAsync(ManualClearingRequest request)
        {
            if (request.LineIds == null || !request.LineIds.Any())
                throw new Exception("No lines selected for clearing.");

            // Fetch lines with their parent entries
            var linesToClear = (await _lineRepo.FindAsync(
                l => request.LineIds.Contains(l.Id),
                l => l.JournalEntry)).ToList();

            if (linesToClear.Count != request.LineIds.Count)
                throw new Exception("Some selected lines were not found.");

            // Validate Sum or Create Residual
            decimal balance = 0;
            foreach (var line in linesToClear)
            {
                if (line.Type == JournalEntryLineType.Debit) balance += line.Amount;
                else balance -= line.Amount;
            }

            var clearingId = Guid.NewGuid();

            // If balance is not zero, create a Residual Item (New Journal Entry)
            if (Math.Abs(balance) > 0.01m)
            {
                // Logic:
                // If Balance is +100 (Debit Surplus), we need -100 (Credit) to clear.
                // The Residual Item should be +100 (Debit) to represent the remaining debt.
                // Wait.
                // Example: Invoice +100 (Dr). Payment -80 (Cr).
                // Selected Balance = +20 (Dr).
                // We want to Clear both (+100, -80).
                // We need to ADD a line of -20 (Cr) to the "Clearing Group" to make it 0.
                // But we can't just add a line. We need a balanced Entry.
                // Entry:
                //   Line A: -20 (Cr). This goes into the Clearing Group. (Status: Cleared)
                //   Line B: +20 (Dr). This is the NEW Open Item. (Status: Open)
                
                // So:
                // BalancingAmount (to be cleared) = -Balance
                // ResidualAmount (to be open) = Balance
                
                var partnerId = linesToClear.First().BusinessPartnerId ?? throw new Exception("Multiple partners or null partner in residual clearing not supported yet.");
                
                // Use the Account of the first line (assuming same account for now usually Trade Receivables)
                // In complex scenarios (different GL accounts), this might need refinement.
                var accountId = linesToClear.First().AccountId;

                // Create Residual Journal Entry
                var residualEntry = new JournalEntry(
                    DateTime.Now, 
                    DateTime.Now, 
                    $"Resíduo de Compensação {DateTime.Now:dd/MM/yyyy}", 
                    "RESIDUAL", 
                    JournalEntryType.Clearing
                );
                
                // 1. The Balancing Line (The one that closes the group)
                // If Balance is positive (Dr), this must be Credit.
                var balancingType = balance > 0 ? JournalEntryLineType.Credit : JournalEntryLineType.Debit;
                residualEntry.AddLine(accountId, Math.Abs(balance), balancingType, null, partnerId);
                
                // 2. The Residual Open Item (The one that stays open)
                // Same direction as the original balance.
                var residualType = balance > 0 ? JournalEntryLineType.Debit : JournalEntryLineType.Credit;
                residualEntry.AddLine(accountId, Math.Abs(balance), residualType, null, partnerId);
                
                await _entryRepo.AddAsync(residualEntry);
                residualEntry.Post(); // Status Posted

                // Now, find the 'Balancing Line' we just created and add it to the 'linesToClear'
                // The Balancing Line is the one with 'balancingType'
                // We need to be careful if both lines have same amount/type (impossible here as they are opposite types).
                
               // Reload lines to get IDs? Or use the object ref.
               // _lines collection provided by AddLine.
               
               var balancingLine = residualEntry.Lines.Last(l => l.Type == balancingType);
               linesToClear.Add(balancingLine);
            }

            // Perform Clearing
            foreach (var line in linesToClear)
            {
                line.Clear(clearingId);
            }

            // We need to save the new Entry (if created) and the updates to existing lines.
            // _entryRepo.AddAsync was called for new entry.
            // _lineRepo.UpdateRangeAsync for the cleared lines.
            
            // However, existing lines might be from different entries.
            // UpdateRangeAsync works on entities.
            
            await _lineRepo.UpdateRangeAsync(linesToClear);

        }
    }
}
