using Aurora.Application.Interfaces.Repositories;
using Aurora.Domain.Entities.Organization;
using Aurora.Infrastructure.Persistence;

namespace Aurora.Infrastructure.Repositories.Organization
{
    public class GrupoEmpresarialRepository : Repository<GrupoEmpresarial>, IGrupoEmpresarialRepository
    {
        public GrupoEmpresarialRepository(AuroraDbContext context) : base(context)
        {
        }
    }

    public class EmpresaRepository : Repository<Empresa>, IEmpresaRepository
    {
        public EmpresaRepository(AuroraDbContext context) : base(context)
        {
        }
    }
}
