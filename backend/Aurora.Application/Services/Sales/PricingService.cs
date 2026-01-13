using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Aurora.Application.Interfaces.Repositories;
using Aurora.Application.Interfaces.Sales;
using Aurora.Domain.Entities.Logistics;
using Aurora.Domain.Entities.Sales;

namespace Aurora.Application.Services.Sales
{
    public class PricingService : IPricingService
    {
        private readonly IPriceListRepository _priceListRepository;
        private readonly IDiscountRuleRepository _discountRepository;
        private readonly IRepository<Material> _materialRepository;

        public PricingService(
            IPriceListRepository priceListRepository,
            IDiscountRuleRepository discountRepository,
            IRepository<Material> materialRepository)
        {
            _priceListRepository = priceListRepository;
            _discountRepository = discountRepository;
            _materialRepository = materialRepository;
        }

        public async Task<PricingResultDto> CalculatePricingAsync(Guid materialId, Guid businessPartnerId, decimal quantity)
        {
            var result = new PricingResultDto();
            var material = await _materialRepository.GetByIdAsync(materialId);
            if (material == null) throw new Exception("Material not found");

            result.BasePrice = material.BasePrice;
            result.EffectivePrice = material.BasePrice;

            // 1. Check Price Lists
            var now = DateTime.Now;
            var priceLists = await _priceListRepository.GetAllWithItemsAsync();
            var activePriceList = priceLists.FirstOrDefault(pl => 
                pl.IsActive && pl.StartDate <= now && pl.EndDate >= now && 
                pl.Items.Any(i => i.MaterialId == materialId));

            if (activePriceList != null)
            {
                var priceItem = activePriceList.Items.First(i => i.MaterialId == materialId);
                result.EffectivePrice = priceItem.Price;
                result.AppliedPriceList = activePriceList.Name;
            }

            // 2. Check Discount Rules
            var discounts = await _discountRepository.GetAllAsync();
            var activeDiscounts = discounts.Where(d => 
                d.IsActive && d.StartDate <= now && d.EndDate >= now &&
                (d.BusinessPartnerId == null || d.BusinessPartnerId == businessPartnerId) &&
                (d.MaterialId == null || d.MaterialId == materialId) &&
                d.MinimumQuantity <= quantity)
                .OrderByDescending(d => d.Type == DiscountType.Percentage ? result.EffectivePrice * (d.Value / 100) : d.Value);

            var bestDiscount = activeDiscounts.FirstOrDefault();
            if (bestDiscount != null)
            {
                result.AppliedDiscountRule = bestDiscount.Name;
                if (bestDiscount.Type == DiscountType.Percentage)
                {
                    result.DiscountPercentage = bestDiscount.Value;
                    result.DiscountAmount = result.EffectivePrice * (bestDiscount.Value / 100);
                }
                else
                {
                    result.DiscountAmount = bestDiscount.Value;
                    result.DiscountPercentage = (result.DiscountAmount / result.EffectivePrice) * 100;
                }
                result.EffectivePrice -= result.DiscountAmount;
            }

            return result;
        }
    }
}
