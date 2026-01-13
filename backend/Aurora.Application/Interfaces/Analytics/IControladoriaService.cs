using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Aurora.Application.Interfaces.Analytics
{
    public interface IControladoriaService
    {
        Task<DreDto> GetDreAsync(DateTime startDate, DateTime endDate, Guid? costCenterId = null, Guid? profitCenterId = null);
        Task<IEnumerable<CostCenterPerformanceDto>> GetCostCenterPerformanceAsync(DateTime startDate, DateTime endDate);
        Task<IEnumerable<ProfitCenterPerformanceDto>> GetProfitCenterPerformanceAsync(DateTime startDate, DateTime endDate);
    }

    public class DreDto
    {
        public decimal GrossRevenue { get; set; }
        public decimal Taxes { get; set; }
        public decimal NetRevenue => GrossRevenue - Taxes;
        public decimal Cogs { get; set; }
        public decimal GrossProfit => NetRevenue - Cogs;
        public decimal OperatingExpenses { get; set; }
        public decimal Ebitda => GrossProfit - OperatingExpenses;
        public decimal NetProfit { get; set; } // After non-operating etc (simplified for now)
        
        public List<DreLineDto> Lines { get; set; } = new List<DreLineDto>();
    }

    public class DreLineDto
    {
        public string AccountCode { get; set; } = string.Empty;
        public string AccountName { get; set; } = string.Empty;
        public decimal Amount { get; set; }
        public bool IsNegative { get; set; }
    }

    public class CostCenterPerformanceDto
    {
        public Guid CostCenterId { get; set; }
        public string CostCenterName { get; set; } = string.Empty;
        public decimal Budget { get; set; }
        public decimal Actual { get; set; }
        public decimal Variance => Budget - Actual;
    }

    public class ProfitCenterPerformanceDto
    {
        public Guid ProfitCenterId { get; set; }
        public string ProfitCenterName { get; set; } = string.Empty;
        public decimal Revenue { get; set; }
        public decimal Expenses { get; set; }
        public decimal NetProfit => Revenue - Expenses;
    }
}
