using Aurora.Application.Interfaces.Repositories;
using Aurora.Domain.Entities.BusinessPartners;
using System;
using System.Threading.Tasks;

namespace Aurora.Application.Interfaces.Repositories
{
    public interface IBusinessPartnerRepository : IRepository<BusinessPartner>
    {
        Task ClearDetailsRawAsync(Guid businessPartnerId);
        // Add specific methods, e.g., FindByCpfCnpj
    }
}
