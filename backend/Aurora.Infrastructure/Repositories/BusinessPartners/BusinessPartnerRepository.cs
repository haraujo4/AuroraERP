using Aurora.Application.Interfaces.Repositories;
using Aurora.Domain.Entities.BusinessPartners;
using Aurora.Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;

namespace Aurora.Infrastructure.Repositories.BusinessPartners
{
    public class BusinessPartnerRepository : Repository<BusinessPartner>, IBusinessPartnerRepository
    {
        public BusinessPartnerRepository(AuroraDbContext context) : base(context)
        {
        }

        public async Task ClearDetailsRawAsync(Guid businessPartnerId)
        {
            var idParam = businessPartnerId.ToString();
            // Use Raw SQL to delete to avoid EF Concurrency checks on deleted rows during Update
            await _context.Database.ExecuteSqlRawAsync("DELETE FROM commercial.\"BusinessPartnerAddresses\" WHERE \"BusinessPartnerId\" = {0}", businessPartnerId);
            await _context.Database.ExecuteSqlRawAsync("DELETE FROM commercial.\"BusinessPartnerContacts\" WHERE \"BusinessPartnerId\" = {0}", businessPartnerId);
        }

        public override async Task UpdateAsync(BusinessPartner entity)
        {
            // Rely on ChangeTracker since entity is loaded and tracked
            // Avoid calling _dbSet.Update(entity) which might disrupt Owned Types state
            await _context.SaveChangesAsync();
        }
    }
}
