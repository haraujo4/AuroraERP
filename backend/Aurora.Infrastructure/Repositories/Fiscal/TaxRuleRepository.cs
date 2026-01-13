using Aurora.Application.Interfaces.Repositories;
using Aurora.Domain.Entities.Fiscal;
using Aurora.Infrastructure.Persistence;

namespace Aurora.Infrastructure.Repositories.Fiscal
{
    public class TaxRuleRepository : Repository<TaxRule>, ITaxRuleRepository
    {
        public TaxRuleRepository(AuroraDbContext context) : base(context)
        {
        }
    }
}
