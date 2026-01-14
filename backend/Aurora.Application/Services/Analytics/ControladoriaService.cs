using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Aurora.Application.Interfaces.Analytics;
using Aurora.Application.Interfaces.Repositories;
using Aurora.Domain.Entities.Finance;
using Aurora.Domain.Enums;

namespace Aurora.Application.Services.Analytics
{
    public class ControladoriaService : IControladoriaService
    {
        private readonly IRepository<JournalEntry> _journalRepo;
        private readonly IRepository<Account> _accountRepo;

        public ControladoriaService(
            IRepository<JournalEntry> journalRepo,
            IRepository<Account> accountRepo)
        {
            _journalRepo = journalRepo;
            _accountRepo = accountRepo;
        }

        public async Task<DreDto> GetDreAsync(DateTime startDate, DateTime endDate, Guid? costCenterId = null, Guid? profitCenterId = null)
        {
            // Ensure endDate encompasses the entire day
            endDate = endDate.Date.AddDays(1).AddTicks(-1);
            
            Console.WriteLine($"[KE30] Fetching for range: {startDate} to {endDate}");

            var entries = await _journalRepo.GetAllAsync(j => j.Lines);
            
            var validEntries = entries.Where(j => 
                j.PostingDate >= startDate && 
                j.PostingDate <= endDate &&
                j.Status == JournalEntryStatus.Posted).ToList();

            Console.WriteLine($"[KE30] Found {validEntries.Count} posted entries in range.");

            var dre = new DreDto();
            var allAccounts = await _accountRepo.GetAllAsync();

            foreach (var entry in validEntries)
            {
                foreach (var line in entry.Lines)
                {
                    // Filter by Cost/Profit center if provided
                    if (costCenterId.HasValue && line.CostCenterId != costCenterId.Value) continue;
                    if (profitCenterId.HasValue && line.ProfitCenterId != profitCenterId.Value) continue;

                    var account = allAccounts.FirstOrDefault(a => a.Id == line.AccountId);
                    if (account == null) continue;

                    decimal amount = line.Amount;
                    
                    // Logic: Revenue is Credit (+), Expense is Debit (+) in DRE terms
                    // But contably: 
                    // Revenue (Nature: Credit) -> Increase by Credit
                    // Expense (Nature: Debit) -> Increase by Debit
                    
                    if (account.Type == AccountType.Revenue)
                    {
                        if (line.Type == JournalEntryLineType.Credit) dre.GrossRevenue += amount;
                        else dre.GrossRevenue -= amount; // Rare, maybe return
                    }
                    else if (account.Type == AccountType.Expense)
                    {
                        if (line.Type == JournalEntryLineType.Debit) dre.OperatingExpenses += amount;
                        else dre.OperatingExpenses -= amount;
                    }

                    // For the line-by-line breakdown
                    var existingLine = dre.Lines.FirstOrDefault(l => l.AccountCode == account.Code);
                    if (existingLine == null)
                    {
                        dre.Lines.Add(new DreLineDto
                        {
                            AccountCode = account.Code,
                            AccountName = account.Name,
                            Amount = (account.Type == AccountType.Revenue ? 1 : -1) * (line.Type == (account.Nature == AccountNature.Credit ? JournalEntryLineType.Credit : JournalEntryLineType.Debit) ? amount : -amount),
                            IsNegative = account.Type == AccountType.Expense
                        });
                    }
                    else
                    {
                        decimal lineEffect = (line.Type == (account.Nature == AccountNature.Credit ? JournalEntryLineType.Credit : JournalEntryLineType.Debit) ? amount : -amount);
                        existingLine.Amount += (account.Type == AccountType.Revenue ? 1 : -1) * lineEffect;
                    }
                }
            }

            dre.NetProfit = dre.GrossProfit - dre.OperatingExpenses;

            return dre;
        }

        public async Task<IEnumerable<CostCenterPerformanceDto>> GetCostCenterPerformanceAsync(DateTime startDate, DateTime endDate)
        {
            var entries = await _journalRepo.GetAllAsync(j => j.Lines);
            var expenseEntries = entries.Where(j => j.PostingDate >= startDate && j.PostingDate <= endDate);

            var performance = new Dictionary<Guid, decimal>();

            foreach (var entry in expenseEntries)
            {
                foreach (var line in entry.Lines)
                {
                    if (line.CostCenterId.HasValue && line.Type == JournalEntryLineType.Debit)
                    {
                        if (!performance.ContainsKey(line.CostCenterId.Value)) performance[line.CostCenterId.Value] = 0;
                        performance[line.CostCenterId.Value] += line.Amount;
                    }
                }
            }

            // In a real scenario, we'd fetch budget data too. For now, budget is 0.
            return performance.Select(p => new CostCenterPerformanceDto
            {
                CostCenterId = p.Key,
                CostCenterName = "CC " + p.Key.ToString().Substring(0, 8),
                Actual = p.Value,
                Budget = p.Value * 1.1m // Simulated budget
            });
        }

        public async Task<IEnumerable<ProfitCenterPerformanceDto>> GetProfitCenterPerformanceAsync(DateTime startDate, DateTime endDate)
        {
            // Similar logic but for Profit Centers, looking at both Revenue and Expense
            return await Task.FromResult(new List<ProfitCenterPerformanceDto>());
        }
    }
}
