using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Aurora.Application.Interfaces.Analytics;
using Aurora.Application.Interfaces.Repositories;
using Aurora.Application.Interfaces.Repositories.Logistics;
using Aurora.Domain.Entities.Finance;
using Aurora.Domain.Entities.Logistics;
using Aurora.Domain.Enums;

namespace Aurora.Application.Services.Analytics
{
    public class ProfitabilityService : IProfitabilityService
    {
        private readonly IRepository<Invoice> _invoiceRepo;
        private readonly IDeliveryRepository _deliveryRepo;
        private readonly IRepository<Material> _materialRepo;

        public ProfitabilityService(
            IRepository<Invoice> invoiceRepo,
            IDeliveryRepository deliveryRepo,
            IRepository<Material> materialRepo)
        {
            _invoiceRepo = invoiceRepo;
            _deliveryRepo = deliveryRepo;
            _materialRepo = materialRepo;
        }

        public async Task<ProfitabilityOverviewDto> GetOverviewAsync(DateTime startDate, DateTime endDate)
        {
            var invoices = await _invoiceRepo.GetAllAsync();
            var salesInvoices = invoices.Where(i => 
                i.Type == InvoiceType.Outbound && 
                i.Status != InvoiceStatus.Cancelled &&
                i.IssueDate >= startDate && i.IssueDate <= endDate);

            var totalRevenue = salesInvoices.Sum(i => i.NetAmount);

            // COGS Calculation: Sum of UnitCost * Quantity from ALL posted deliveries in the period
            var deliveries = await _deliveryRepo.GetAllWithDetailsAsync();
            var postedDeliveries = deliveries.Where(d => 
                d.Status == DeliveryStatus.Posted && 
                d.PostingDate >= startDate && d.PostingDate <= endDate);

            decimal totalCogs = 0;
            foreach (var delivery in postedDeliveries)
            {
                totalCogs += delivery.Items.Sum(item => item.Quantity * item.UnitCost);
            }

            return new ProfitabilityOverviewDto
            {
                TotalRevenue = totalRevenue,
                TotalCogs = totalCogs
            };
        }

        public async Task<IEnumerable<MaterialMarginDto>> GetTopMaterialsByMarginAsync(int count)
        {
            var invoices = await _invoiceRepo.GetAllAsync();
            var salesInvoices = invoices.Where(i => i.Type == InvoiceType.Outbound && i.Status != InvoiceStatus.Cancelled);
            
            var deliveries = await _deliveryRepo.GetAllWithDetailsAsync();
            var postedDeliveries = deliveries.Where(d => d.Status == DeliveryStatus.Posted);

            var materialData = new Dictionary<Guid, (decimal Revenue, decimal Cogs)>();

            // Aggregate Revenue
            foreach (var invoice in salesInvoices)
            {
                // In a detailed implementation, we would loop through invoice items. 
                // For MVP, if materialId is not explicitly on invoice item (it is in our latest edit), we use it.
                foreach (var item in invoice.Items)
                {
                    if (item.MaterialId.HasValue)
                    {
                        var mid = item.MaterialId.Value;
                        if (!materialData.ContainsKey(mid)) materialData[mid] = (0, 0);
                        var current = materialData[mid];
                        materialData[mid] = (current.Revenue + item.TotalAmount, current.Cogs);
                    }
                }
            }

            // Aggregate COGS
            foreach (var delivery in postedDeliveries)
            {
                foreach (var item in delivery.Items)
                {
                    if (!materialData.ContainsKey(item.MaterialId)) materialData[item.MaterialId] = (0, 0);
                    var current = materialData[item.MaterialId];
                    materialData[item.MaterialId] = (current.Revenue, current.Cogs + (item.Quantity * item.UnitCost));
                }
            }

            var result = new List<MaterialMarginDto>();
            foreach (var kvp in materialData)
            {
                var material = await _materialRepo.GetByIdAsync(kvp.Key);
                result.Add(new MaterialMarginDto
                {
                    MaterialId = kvp.Key,
                    MaterialName = material?.Description ?? "Unknown",
                    Revenue = kvp.Value.Revenue,
                    Cogs = kvp.Value.Cogs
                });
            }

            return result.OrderByDescending(r => r.MarginPercentage).Take(count);
        }

        public async Task<IEnumerable<PartnerProfitabilityDto>> GetPartnerProfitabilityAsync()
        {
            var invoices = await _invoiceRepo.GetAllAsync();
            var salesInvoices = invoices.Where(i => i.Type == InvoiceType.Outbound && i.Status != InvoiceStatus.Cancelled);

            // Group by Id and use a placeholder for name (or fetch from ref navigation if loaded)
            var partnerData = salesInvoices.GroupBy(i => i.BusinessPartnerId)
                .Select(g => new PartnerProfitabilityDto
                {
                    BusinessPartnerId = g.Key,
                    PartnerName = "Partner " + g.Key.ToString().Substring(0, 8), // Simplified name for now
                    TotalSales = g.Sum(i => i.NetAmount),
                    TotalProfit = 0 
                }).ToList();

            return await Task.FromResult(partnerData.AsEnumerable());
        }
    }
}
