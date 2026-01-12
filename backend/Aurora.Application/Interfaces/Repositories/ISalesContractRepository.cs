using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Aurora.Domain.Entities.Sales;

namespace Aurora.Application.Interfaces.Repositories
{
    public interface ISalesContractRepository : IRepository<SalesContract>
    {
        Task<IEnumerable<SalesContract>> GetAllWithDetailsAsync();
        Task<SalesContract> GetByIdWithDetailsAsync(Guid id);
    }
}
