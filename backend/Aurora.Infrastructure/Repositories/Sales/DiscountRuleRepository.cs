using Aurora.Application.Interfaces.Repositories;
using Aurora.Domain.Entities.Sales;
using Aurora.Infrastructure.Persistence;

namespace Aurora.Infrastructure.Repositories.Sales
{
    public class DiscountRuleRepository : Repository<DiscountRule>, IDiscountRuleRepository
    {
        public DiscountRuleRepository(AuroraDbContext context) : base(context)
        {
        }
    }
}
