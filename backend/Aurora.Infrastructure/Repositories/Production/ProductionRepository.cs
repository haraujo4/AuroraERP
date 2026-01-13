using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Aurora.Application.Interfaces.Repositories;
using Aurora.Domain.Entities.Organization;
using Aurora.Domain.Entities.Production;
using Aurora.Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;

namespace Aurora.Infrastructure.Repositories.Production
{
    public class ProductionRepository : IProductionRepository
    {
        private readonly AuroraDbContext _context;

        public ProductionRepository(AuroraDbContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<BillOfMaterial>> GetBOMsWithProductAsync()
        {
            return await _context.BillOfMaterials
                .Include(b => b.Product)
                .ToListAsync();
        }

        public async Task<BillOfMaterial?> GetBOMWithItemsAsync(Guid id)
        {
            return await _context.BillOfMaterials
                .Include(b => b.Product)
                .Include(b => b.Items).ThenInclude(i => i.Component)
                .FirstOrDefaultAsync(x => x.Id == id);
        }

        public async Task<BillOfMaterial?> GetActiveBOMForProductAsync(Guid productId)
        {
            return await _context.BillOfMaterials
                .Include(b => b.Items)
                .FirstOrDefaultAsync(b => b.ProductId == productId && b.IsActive);
        }

        public async Task<IEnumerable<ProductionOrder>> GetOrdersWithDetailsAsync()
        {
            return await _context.ProductionOrders
                .Include(o => o.Product)
                .Include(o => o.WorkCenter)
                .ToListAsync();
        }

        public async Task<ProductionOrder?> GetOrderWithDetailsAsync(Guid id)
        {
            return await _context.ProductionOrders
                .Include(o => o.Product)
                .Include(o => o.WorkCenter)
                .FirstOrDefaultAsync(x => x.Id == id);
        }

        public async Task<string> GenerateOrderNumberAsync()
        {
            var count = await _context.ProductionOrders.CountAsync();
            return $"PO-{DateTime.Now.Year}-{count + 1:0000}";
        }

        public async Task<Deposito?> GetDefaultDepositoAsync()
        {
            return await _context.Set<Deposito>().FirstOrDefaultAsync();
        }
    }
}
