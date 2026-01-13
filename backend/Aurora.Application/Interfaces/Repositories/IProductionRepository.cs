using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Aurora.Domain.Entities.Organization;
using Aurora.Domain.Entities.Production;

namespace Aurora.Application.Interfaces.Repositories
{
    public interface IProductionRepository
    {
        // BOMs
        Task<IEnumerable<BillOfMaterial>> GetBOMsWithProductAsync();
        Task<BillOfMaterial?> GetBOMWithItemsAsync(Guid id);
        Task<BillOfMaterial?> GetActiveBOMForProductAsync(Guid productId);
        
        // Orders
        Task<IEnumerable<ProductionOrder>> GetOrdersWithDetailsAsync();
        Task<ProductionOrder?> GetOrderWithDetailsAsync(Guid id);
        Task<string> GenerateOrderNumberAsync();
        
        // Misc
        Task<Deposito?> GetDefaultDepositoAsync();
    }
}
