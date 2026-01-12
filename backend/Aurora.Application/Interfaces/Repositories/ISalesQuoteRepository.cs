using Aurora.Domain.Entities.Sales;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Aurora.Application.Interfaces.Repositories
{
    public interface ISalesQuoteRepository : IRepository<SalesQuote>
    {
        Task<IEnumerable<SalesQuote>> GetAllWithDetailsAsync();
        Task<SalesQuote> GetByIdWithDetailsAsync(Guid id);
    }
}
