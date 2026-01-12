using Aurora.Application.Interfaces.Repositories;
using Aurora.Domain.Entities.BusinessPartners;

namespace Aurora.Application.Interfaces.Repositories
{
    public interface IBusinessPartnerRepository : IRepository<BusinessPartner>
    {
        // Add specific methods, e.g., FindByCpfCnpj
    }
}
