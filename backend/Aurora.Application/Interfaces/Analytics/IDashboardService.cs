using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Aurora.Application.Interfaces.Analytics
{
    public interface IDashboardService
    {
        Task<DashboardDto> GetFinancialOverviewAsync();
    }

    public class DashboardDto
    {
        public decimal TotalReceivable { get; set; }
        public decimal TotalPayable { get; set; }
        public decimal MonthlySales { get; set; }
        public decimal MonthlyExpenses { get; set; }
        public decimal MonthlyGrossProfit { get; set; }
        public decimal GrossMarginPercentage { get; set; }
        public List<RecentActivityDto> RecentActivities { get; set; } = new();
        public List<ChartDataDto> SalesTrend { get; set; } = new();
    }

    public class RecentActivityDto
    {
        public string Description { get; set; }
        public decimal Value { get; set; }
        public DateTime Date { get; set; }
        public string Type { get; set; } // Sale, Expense, Payment
    }

    public class ChartDataDto
    {
        public string Label { get; set; }
        public decimal Value { get; set; }
    }
}
