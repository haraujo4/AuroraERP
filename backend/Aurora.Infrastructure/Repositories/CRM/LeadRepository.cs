using Aurora.Application.Interfaces.Repositories;
using Aurora.Domain.Entities.CRM;
using Aurora.Infrastructure.Persistence;

namespace Aurora.Infrastructure.Repositories.CRM
{
    public class LeadRepository : Repository<Lead>, ILeadRepository
    {
        public LeadRepository(AuroraDbContext context) : base(context)
        {
        }

        public async Task AddInteractionAsync(Lead lead, LeadInteraction interaction)
        {
            await _context.LeadInteractions.AddAsync(interaction);
            // lead.AddInteraction(interaction); // Already added in service/domain, but safe to ignore if duplicated check in domain? 
            // Better to let service handle domain logic, repo handles persistence.
            await _context.SaveChangesAsync();
        }
    }
}
