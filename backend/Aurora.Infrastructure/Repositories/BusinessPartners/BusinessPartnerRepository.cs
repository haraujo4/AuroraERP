using Aurora.Application.Interfaces.Repositories;
using Aurora.Domain.Entities.BusinessPartners;
using Aurora.Infrastructure.Persistence;

namespace Aurora.Infrastructure.Repositories.BusinessPartners
{
    public class BusinessPartnerRepository : Repository<BusinessPartner>, IBusinessPartnerRepository
    {
        public BusinessPartnerRepository(AuroraDbContext context) : base(context)
        {
        }

        // Implementation of specific methods if needed
    }
}
