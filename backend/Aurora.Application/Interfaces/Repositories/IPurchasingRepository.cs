using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Aurora.Domain.Entities.Purchasing;

namespace Aurora.Application.Interfaces.Repositories
{
    public interface IPurchasingRepository
    {
        // Requisitions
        Task AddRequisitionAsync(PurchaseRequisition requisition);
        Task<PurchaseRequisition?> GetRequisitionByIdAsync(Guid id);
        Task<IEnumerable<PurchaseRequisition>> GetAllRequisitionsAsync();
        Task<int> GetRequisitionCountAsync();
        
        // Orders
        Task AddOrderAsync(PurchaseOrder order);
        Task<PurchaseOrder?> GetOrderByIdAsync(Guid id);
        Task<IEnumerable<PurchaseOrder>> GetAllOrdersAsync();
        Task<IEnumerable<PurchaseOrder>> GetAllOrdersWithDetailsAsync();
        Task<int> GetOrderCountAsync();

        Task SaveChangesAsync();
    }
}
