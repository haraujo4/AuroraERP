using System;
using System.Threading.Tasks;
using Aurora.Domain.Entities.Logistics;

namespace Aurora.Application.Interfaces.Logistics
{
    public interface IBatchService
    {
        Task<Batch> CreateAsync(Guid materialId, string batchNumber, DateTime? manufacturingDate, DateTime? expirationDate, string? supplierBatchNumber = null);
        Task<Batch> GetByMaterialAndNumberAsync(Guid materialId, string batchNumber);
    }
}
