using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Aurora.Application.Interfaces.Planning;
using Aurora.Application.Interfaces.Repositories;
using Aurora.Domain.Entities.Logistics;
using Aurora.Domain.Entities.Sales;
using Aurora.Domain.Entities.Purchasing;
using Aurora.Domain.Entities.Production;
using Aurora.Domain.Enums;

namespace Aurora.Application.Services.Planning
{
    public class MRPService : IMRPService
    {
        private readonly IRepository<Material> _materialRepo;
        private readonly IRepository<StockLevel> _stockRepo;
        private readonly ISalesOrderRepository _salesRepo;
        private readonly IPurchasingRepository _purchasingRepo;
        private readonly IProductionRepository _productionRepo;

        public MRPService(
            IRepository<Material> materialRepo,
            IRepository<StockLevel> stockRepo,
            ISalesOrderRepository salesRepo,
            IPurchasingRepository purchasingRepo,
            IProductionRepository productionRepo)
        {
            _materialRepo = materialRepo;
            _stockRepo = stockRepo;
            _salesRepo = salesRepo;
            _purchasingRepo = purchasingRepo;
            _productionRepo = productionRepo;
        }

        public async Task<MRPResultDto> RunMRPAsync()
        {
            var result = new MRPResultDto { ExecutionTime = DateTime.Now };
            
            var allMaterials = await _materialRepo.GetAllAsync();
            var allStock = await _stockRepo.GetAllAsync();
            
            // Demand: Confirmed Sales Orders
            var salesOrders = await _salesRepo.GetAllWithDetailsAsync();
            var openSales = salesOrders.Where(s => s.Status == SalesOrderStatus.Confirmed || s.Status == SalesOrderStatus.Processing);

            // Demand: Components from Released Production Orders
            var productionOrders = await _productionRepo.GetOrdersWithDetailsAsync();
            var openProduction = productionOrders.Where(p => 
                p.Status == ProductionOrderStatus.Released || 
                p.Status == ProductionOrderStatus.InProgress);

            // Supply: Approved Purchase Orders
            var purchaseOrders = await _purchasingRepo.GetAllOrdersWithDetailsAsync();
            var openPurchases = purchaseOrders.Where(p => p.Status == PurchasingStatus.Approved);

            // Supply: Scheduled Production Orders (Supply of Finished Goods)
            // (Already fetched in openProduction)

            foreach (var material in allMaterials)
            {
                // 1. Current Stock
                decimal currentStock = allStock.Where(s => s.MaterialId == material.Id).Sum(s => s.Quantity);

                // 2. Total Demand
                decimal demand = 0;
                // From Sales
                foreach (var so in openSales)
                {
                    demand += so.Items.Where(i => i.MaterialId == material.Id).Sum(i => i.Quantity);
                }
                // From Production Components
                foreach (var po in openProduction)
                {
                    demand += po.Components.Where(c => c.ComponentId == material.Id).Sum(c => c.QuantityRequired - c.QuantityConsumed);
                }

                // 3. Total Supply (Incoming)
                decimal supply = 0;
                // From Purchases
                foreach (var po in openPurchases)
                {
                    supply += po.Items.Where(i => i.MaterialId == material.Id).Sum(i => i.Quantity);
                }
                // From Production (Finished Goods)
                foreach(var po in openProduction)
                {
                    if (po.ProductId == material.Id) supply += po.Quantity;
                }

                // 4. Net Requirement
                decimal netRequirement = (currentStock + supply) - (demand + material.SafetyStock);

                if (netRequirement < 0)
                {
                    decimal missingQty = Math.Abs(netRequirement);
                    string actionType = material.ProcurementType == ProcurementType.Manufacture ? "ProductionOrder" : "PurchaseRequisition";
                    
                    result.Recommendations.Add(new MRPRecommendationDto
                    {
                        MaterialId = material.Id,
                        MaterialCode = material.Code,
                        MaterialDescription = material.Description,
                        Quantity = missingQty,
                        RequiredDate = DateTime.Now.AddDays(material.LeadTimeDays),
                        ActionType = actionType,
                        Reason = $"Insufficient stock for demand. Stock: {currentStock}, Safety: {material.SafetyStock}, Demand: {demand}, Supply: {supply}"
                    });
                }
            }

            return result;
        }
    }
}
