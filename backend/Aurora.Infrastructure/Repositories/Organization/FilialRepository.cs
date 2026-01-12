using Aurora.Application.Interfaces.Repositories;
using Aurora.Domain.Entities.Organization;
using Aurora.Infrastructure.Persistence;

namespace Aurora.Infrastructure.Repositories.Organization
{
    public class FilialRepository : Repository<Filial>, IFilialRepository
    {
        public FilialRepository(AuroraDbContext context) : base(context)
        {
        }
    }
}
