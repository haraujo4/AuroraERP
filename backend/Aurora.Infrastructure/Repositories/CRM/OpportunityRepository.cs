using Aurora.Application.Interfaces.Repositories;
using Aurora.Domain.Entities.CRM;
using Aurora.Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Aurora.Infrastructure.Repositories.CRM
{
    public class OpportunityRepository : Repository<Opportunity>, IOpportunityRepository
    {
        public OpportunityRepository(AuroraDbContext context) : base(context)
        {
        }
        
        public override async Task<IEnumerable<Opportunity>> GetAllAsync()
        {
            return await _context.Opportunities
                .Include(o => o.BusinessPartner)
                .Include(o => o.Lead)
                .ToListAsync();
        }

        public override async Task<Opportunity?> GetByIdAsync(Guid id)
        {
             return await _context.Opportunities
                .Include(o => o.BusinessPartner)
                .Include(o => o.Lead)
                .FirstOrDefaultAsync(o => o.Id == id);
        }
    }
}
