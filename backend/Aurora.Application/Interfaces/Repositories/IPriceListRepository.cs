using System.Collections.Generic;
using System.Threading.Tasks;
using Aurora.Domain.Entities.Sales;

namespace Aurora.Application.Interfaces.Repositories
{
    public interface IPriceListRepository : IRepository<PriceList>
    {
        Task<IEnumerable<PriceList>> GetAllWithItemsAsync();
    }
}
