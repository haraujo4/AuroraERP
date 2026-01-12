using Aurora.Domain.Entities.Sales;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Aurora.Application.Interfaces.Repositories
{
    public interface ISalesOrderRepository : IRepository<SalesOrder>
    {
        Task<IEnumerable<SalesOrder>> GetAllWithDetailsAsync();
        Task<SalesOrder> GetByIdWithDetailsAsync(Guid id);
    }
}
