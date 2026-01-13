using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Aurora.Application.DTOs.Purchasing;
using Aurora.Domain.Entities.Purchasing;

namespace Aurora.Application.Interfaces.Purchasing
{
    public interface IPurchasingService
    {
        // Requisitions
        Task<PurchaseRequisition> CreateRequisitionAsync(CreatePurchaseRequisitionDto dto);
        Task<PurchaseRequisition?> GetRequisitionByIdAsync(Guid id);
        Task<IEnumerable<PurchaseRequisition>> GetAllRequisitionsAsync();
        Task ApproveRequisitionAsync(Guid id);
        
        // Orders
        Task<PurchaseOrder> CreateOrderAsync(CreatePurchaseOrderDto dto);
        Task<PurchaseOrder?> GetOrderByIdAsync(Guid id);
        Task<IEnumerable<PurchaseOrder>> GetAllOrdersAsync();
        Task ApproveOrderAsync(Guid id);
        Task ReceiveOrderAsync(Guid id); // Basic implementation for now
    }
}
