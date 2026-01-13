using Aurora.Application.Interfaces.Repositories.Logistics;
using Aurora.Domain.Entities.Logistics;
using Aurora.Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Aurora.Infrastructure.Repositories.Logistics
{
    public class DeliveryRepository : Repository<Delivery>, IDeliveryRepository
    {
        public DeliveryRepository(AuroraDbContext context) : base(context)
        {
        }

        public async Task<IEnumerable<Delivery>> GetAllWithDetailsAsync()
        {
            return await _context.Deliveries
                .Include(d => d.Items)
                .ToListAsync();
        }

        public async Task<Delivery> GetByIdWithDetailsAsync(Guid id)
        {
            return await _context.Deliveries
                .Include(d => d.Items)
                .FirstOrDefaultAsync(d => d.Id == id);
        }
    }
}
