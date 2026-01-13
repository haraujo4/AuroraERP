using System;
using System.Threading.Tasks;

namespace Aurora.Application.Interfaces.Sales
{
    public interface IPricingService
    {
        Task<PricingResultDto> CalculatePricingAsync(Guid materialId, Guid businessPartnerId, decimal quantity);
    }

    public class PricingResultDto
    {
        public decimal BasePrice { get; set; }
        public decimal EffectivePrice { get; set; }
        public decimal DiscountAmount { get; set; }
        public decimal DiscountPercentage { get; set; }
        public string AppliedPriceList { get; set; }
        public string AppliedDiscountRule { get; set; }
    }
}
