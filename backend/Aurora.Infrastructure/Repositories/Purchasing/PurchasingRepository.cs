using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Aurora.Application.Interfaces.Repositories;
using Aurora.Domain.Entities.Purchasing;
using Aurora.Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;

namespace Aurora.Infrastructure.Repositories.Purchasing
{
    public class PurchasingRepository : IPurchasingRepository
    {
        private readonly AuroraDbContext _context;

        public PurchasingRepository(AuroraDbContext context)
        {
            _context = context;
        }

        // Requisitions
        public async Task AddRequisitionAsync(PurchaseRequisition requisition)
        {
            await _context.PurchaseRequisitions.AddAsync(requisition);
        }

        public async Task<PurchaseRequisition?> GetRequisitionByIdAsync(Guid id)
        {
             return await _context.PurchaseRequisitions
                .Include(r => r.Items)
                .ThenInclude(i => i.Material)
                .Include(r => r.Items)
                .ThenInclude(i => i.CostCenter)
                .FirstOrDefaultAsync(r => r.Id == id);
        }

        public async Task<IEnumerable<PurchaseRequisition>> GetAllRequisitionsAsync()
        {
             return await _context.PurchaseRequisitions
                .Include(r => r.Items)
                .OrderByDescending(r => r.RequestDate)
                .ToListAsync();
        }
        
        public async Task<int> GetRequisitionCountAsync()
        {
            return await _context.PurchaseRequisitions.CountAsync();
        }

        // Orders
        public async Task AddOrderAsync(PurchaseOrder order)
        {
            await _context.PurchaseOrders.AddAsync(order);
        }

        public async Task<PurchaseOrder?> GetOrderByIdAsync(Guid id)
        {
             return await _context.PurchaseOrders
                .Include(o => o.Supplier)
                .Include(o => o.Items)
                .ThenInclude(i => i.Material)
                .FirstOrDefaultAsync(o => o.Id == id);
        }

        public async Task<IEnumerable<PurchaseOrder>> GetAllOrdersAsync()
        {
              return await _context.PurchaseOrders
                .Include(o => o.Supplier)
                .OrderByDescending(o => o.OrderDate)
                .ToListAsync();
        }

        public async Task<IEnumerable<PurchaseOrder>> GetAllOrdersWithDetailsAsync()
        {
              return await _context.PurchaseOrders
                .Include(o => o.Supplier)
                .Include(o => o.Items)
                .OrderByDescending(o => o.OrderDate)
                .ToListAsync();
        }

         public async Task<int> GetOrderCountAsync()
        {
            return await _context.PurchaseOrders.CountAsync();
        }

        public async Task SaveChangesAsync()
        {
            await _context.SaveChangesAsync();
        }
    }
}
