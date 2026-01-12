using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Aurora.Application.Interfaces.Repositories;
using Aurora.Domain.Entities.Sales;
using Aurora.Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;

namespace Aurora.Infrastructure.Repositories.Sales
{
    public class SalesContractRepository : Repository<SalesContract>, ISalesContractRepository
    {
        public SalesContractRepository(AuroraDbContext context) : base(context)
        {
        }

        public async Task<IEnumerable<SalesContract>> GetAllWithDetailsAsync()
        {
            return await _context.SalesContracts
                .Include(c => c.BusinessPartner)
                .Include(c => c.Items)
                .ThenInclude(i => i.Material)
                .ToListAsync();
        }

        public async Task<SalesContract> GetByIdWithDetailsAsync(Guid id)
        {
             return await _context.SalesContracts
                .Include(c => c.BusinessPartner)
                .Include(c => c.Items)
                .ThenInclude(i => i.Material)
                .FirstOrDefaultAsync(c => c.Id == id);
        }
    }
}
