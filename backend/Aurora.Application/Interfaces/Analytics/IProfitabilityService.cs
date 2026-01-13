using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Aurora.Application.Interfaces.Analytics
{
    public interface IProfitabilityService
    {
        Task<ProfitabilityOverviewDto> GetOverviewAsync(DateTime startDate, DateTime endDate);
        Task<IEnumerable<MaterialMarginDto>> GetTopMaterialsByMarginAsync(int count);
        Task<IEnumerable<PartnerProfitabilityDto>> GetPartnerProfitabilityAsync();
    }

    public class ProfitabilityOverviewDto
    {
        public decimal TotalRevenue { get; set; }
        public decimal TotalCogs { get; set; }
        public decimal GrossProfit => TotalRevenue - TotalCogs;
        public decimal GrossMargin => TotalRevenue > 0 ? (GrossProfit / TotalRevenue) * 100 : 0;
    }

    public class MaterialMarginDto
    {
        public Guid MaterialId { get; set; }
        public string MaterialName { get; set; } = string.Empty;
        public decimal Revenue { get; set; }
        public decimal Cogs { get; set; }
        public decimal MarginPercentage => Revenue > 0 ? ((Revenue - Cogs) / Revenue) * 100 : 0;
    }

    public class PartnerProfitabilityDto
    {
        public Guid BusinessPartnerId { get; set; }
        public string PartnerName { get; set; } = string.Empty;
        public decimal TotalSales { get; set; }
        public decimal TotalProfit { get; set; }
    }
}
