using Aurora.Application.Interfaces.Repositories;
using Aurora.Domain.Entities.CRM;
using Aurora.Infrastructure.Persistence;

namespace Aurora.Infrastructure.Repositories.CRM
{
    public class LeadRepository : Repository<Lead>, ILeadRepository
    {
        public LeadRepository(AuroraDbContext context) : base(context)
        {
        }
    }
}
