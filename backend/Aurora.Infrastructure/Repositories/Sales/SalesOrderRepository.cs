using Aurora.Application.Interfaces.Repositories;
using Aurora.Domain.Entities.Sales;
using Aurora.Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Aurora.Infrastructure.Repositories.Sales
{
    public class SalesOrderRepository : Repository<SalesOrder>, ISalesOrderRepository
    {
        public SalesOrderRepository(AuroraDbContext context) : base(context)
        {
        }

        public async Task<IEnumerable<SalesOrder>> GetAllWithDetailsAsync()
        {
            return await _context.SalesOrders
                .Include(o => o.BusinessPartner)
                .Include(o => o.Items)
                .ThenInclude(i => i.Material)
                .ToListAsync();
        }

        public async Task<SalesOrder> GetByIdWithDetailsAsync(Guid id)
        {
            return await _context.SalesOrders
                .Include(o => o.BusinessPartner)
                .Include(o => o.Items)
                .ThenInclude(i => i.Material)
                .FirstOrDefaultAsync(o => o.Id == id);
        }
    }
}
