using Aurora.Application.Interfaces.Repositories;
using Aurora.Domain.Entities.Sales;
using Aurora.Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Aurora.Infrastructure.Repositories.Sales
{
    public class SalesQuoteRepository : Repository<SalesQuote>, ISalesQuoteRepository
    {
        public SalesQuoteRepository(AuroraDbContext context) : base(context)
        {
        }

        public async Task<IEnumerable<SalesQuote>> GetAllWithDetailsAsync()
        {
            return await _context.SalesQuotes
                .Include(q => q.BusinessPartner)
                .Include(q => q.Opportunity)
                .Include(q => q.Items)
                .ThenInclude(i => i.Material)
                .ToListAsync();
        }

        public async Task<SalesQuote> GetByIdWithDetailsAsync(Guid id)
        {
            return await _context.SalesQuotes
                .Include(q => q.BusinessPartner)
                .Include(q => q.Opportunity)
                .Include(q => q.Items)
                .ThenInclude(i => i.Material)
                .FirstOrDefaultAsync(q => q.Id == id);
        }
    }
}
