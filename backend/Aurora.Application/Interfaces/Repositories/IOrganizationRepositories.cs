using Aurora.Domain.Entities.Organization;

namespace Aurora.Application.Interfaces.Repositories
{
    public interface IGrupoEmpresarialRepository : IRepository<GrupoEmpresarial>
    {
        // Add specific methods if needed, e.g., GetByCodigo
    }

    public interface IEmpresaRepository : IRepository<Empresa>
    {
    }
}
