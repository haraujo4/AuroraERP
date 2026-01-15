using System;
using System.Threading.Tasks;
using Aurora.Domain.Entities.Logistics;
using Aurora.Application.Interfaces.Repositories;
using Aurora.Application.Interfaces.Logistics; // Added using
using System.Linq;

namespace Aurora.Application.Services.Logistics
{
    public class BatchService : IBatchService
    {
        private readonly IRepository<Batch> _batchRepository;

        public BatchService(IRepository<Batch> batchRepository)
        {
            _batchRepository = batchRepository;
        }

        public async Task<Batch> CreateAsync(Guid materialId, string batchNumber, DateTime? manufacturingDate, DateTime? expirationDate, string? supplierBatchNumber = null)
        {
            // Validate Uniqueness
            var existing = await GetByMaterialAndNumberAsync(materialId, batchNumber);
            if (existing != null)
                throw new Exception($"Batch {batchNumber} already exists for this material.");

            var batch = new Batch(materialId, batchNumber, manufacturingDate, expirationDate, supplierBatchNumber);
            await _batchRepository.AddAsync(batch);
            return batch;
        }

        public async Task<Batch> GetByMaterialAndNumberAsync(Guid materialId, string batchNumber)
        {
            var batches = await _batchRepository.FindAsync(b => b.MaterialId == materialId && b.BatchNumber == batchNumber);
            return batches.FirstOrDefault();
        }
    }
}
