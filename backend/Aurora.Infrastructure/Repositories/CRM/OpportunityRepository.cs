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
        
        public override async Task<IEnumerable<Opportunity>> GetAllAsync(params System.Linq.Expressions.Expression<Func<Opportunity, object>>[] includes)
        {
            IQueryable<Opportunity> query = _context.Opportunities
                .Include(o => o.BusinessPartner)
                .Include(o => o.Lead);

            foreach (var include in includes)
            {
                query = query.Include(include);
            }

            return await query.ToListAsync();
        }

        public override async Task<Opportunity?> GetByIdAsync(Guid id, params System.Linq.Expressions.Expression<Func<Opportunity, object>>[] includes)
        {
             IQueryable<Opportunity> query = _context.Opportunities
                .Include(o => o.BusinessPartner)
                .Include(o => o.Lead);

            foreach (var include in includes)
            {
                query = query.Include(include);
            }

            return await query.FirstOrDefaultAsync(o => o.Id == id);
        }
    }
}
