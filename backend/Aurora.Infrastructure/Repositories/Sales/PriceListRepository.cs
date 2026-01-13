using System.Collections.Generic;
using System.Threading.Tasks;
using Aurora.Application.Interfaces.Repositories;
using Aurora.Domain.Entities.Sales;
using Aurora.Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;

namespace Aurora.Infrastructure.Repositories.Sales
{
    public class PriceListRepository : Repository<PriceList>, IPriceListRepository
    {
        public PriceListRepository(AuroraDbContext context) : base(context)
        {
        }

        public async Task<IEnumerable<PriceList>> GetAllWithItemsAsync()
        {
            return await _dbSet
                .Include(pl => pl.Items)
                .ThenInclude(i => i.Material)
                .ToListAsync();
        }
    }
}
