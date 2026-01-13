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
    public class DashboardService : IDashboardService
    {
        private readonly IRepository<Invoice> _invoiceRepository;
        private readonly IRepository<Payment> _paymentRepository;
        private readonly IProfitabilityService _profitabilityService;

        public DashboardService(
            IRepository<Invoice> invoiceRepository,
            IRepository<Payment> paymentRepository,
            IProfitabilityService profitabilityService)
        {
            _invoiceRepository = invoiceRepository;
            _paymentRepository = paymentRepository;
            _profitabilityService = profitabilityService;
        }

        public async Task<DashboardDto> GetFinancialOverviewAsync()
        {
            var invoices = await _invoiceRepository.GetAllAsync();
            var payments = await _paymentRepository.GetAllAsync();
            var now = DateTime.Now;
            var startOfMonth = new DateTime(now.Year, now.Month, 1);
            var endOfMonth = startOfMonth.AddMonths(1).AddDays(-1);

            var dto = new DashboardDto();

            // Total Receivable/Payable (Unpaid Invoices)
            dto.TotalReceivable = invoices.Where(i => i.Type == InvoiceType.Outbound && i.Status != InvoiceStatus.Paid && i.Status != InvoiceStatus.Cancelled).Sum(i => i.GrossAmount);
            dto.TotalPayable = invoices.Where(i => i.Type == InvoiceType.Inbound && i.Status != InvoiceStatus.Paid && i.Status != InvoiceStatus.Cancelled).Sum(i => i.GrossAmount);

            // Monthly Metrics
            dto.MonthlySales = invoices.Where(i => i.Type == InvoiceType.Outbound && i.IssueDate >= startOfMonth && i.Status != InvoiceStatus.Cancelled).Sum(i => i.GrossAmount);
            dto.MonthlyExpenses = invoices.Where(i => i.Type == InvoiceType.Inbound && i.IssueDate >= startOfMonth && i.Status != InvoiceStatus.Cancelled).Sum(i => i.GrossAmount);

            // Profitability Metrics
            var profitOverview = await _profitabilityService.GetOverviewAsync(startOfMonth, endOfMonth);
            dto.MonthlyGrossProfit = profitOverview.GrossProfit;
            dto.GrossMarginPercentage = profitOverview.GrossMargin;

            // Recent Activities
            var recentInvoices = invoices.OrderByDescending(i => i.CreatedAt).Take(5);
            foreach (var inv in recentInvoices)
            {
                dto.RecentActivities.Add(new RecentActivityDto
                {
                    Description = $"Fatura {inv.Number}",
                    Value = inv.GrossAmount,
                    Date = inv.CreatedAt,
                    Type = inv.Type == InvoiceType.Outbound ? "Venda" : "Compra"
                });
            }

            // Sales Trend (Last 6 months)
            for (int i = 5; i >= 0; i--)
            {
                var targetMonth = now.AddMonths(-i);
                var monthLabel = targetMonth.ToString("MMM/yy");
                var monthSales = invoices.Where(inv => 
                    inv.Type == InvoiceType.Outbound && 
                    inv.IssueDate.Month == targetMonth.Month && 
                    inv.IssueDate.Year == targetMonth.Year &&
                    inv.Status != InvoiceStatus.Cancelled)
                    .Sum(inv => inv.GrossAmount);

                dto.SalesTrend.Add(new ChartDataDto { Label = monthLabel, Value = monthSales });
            }

            return dto;
        }
    }
}
