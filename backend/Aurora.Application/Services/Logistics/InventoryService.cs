using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Aurora.Application.Interfaces.Logistics;
using Aurora.Application.Interfaces.Repositories;
using Aurora.Domain.Entities.Logistics;
using Aurora.Domain.Enums;

namespace Aurora.Application.Services.Logistics
{
    public class InventoryService : IInventoryService
    {
        private readonly IRepository<StockLevel> _stockLevelRepo;
        private readonly IRepository<StockMovement> _stockMovementRepo;
        private readonly IRepository<Aurora.Domain.Entities.Logistics.Material> _materialRepo;
        private readonly IRepository<Aurora.Domain.Entities.Organization.Deposito> _depositoRepo;

        public InventoryService(
            IRepository<StockLevel> stockLevelRepo,
            IRepository<StockMovement> stockMovementRepo,
            IRepository<Aurora.Domain.Entities.Logistics.Material> materialRepo,
            IRepository<Aurora.Domain.Entities.Organization.Deposito> depositoRepo)
        {
            _stockLevelRepo = stockLevelRepo;
            _stockMovementRepo = stockMovementRepo;
            _materialRepo = materialRepo;
            _depositoRepo = depositoRepo;
        }

        public async Task<decimal> GetStockLevelAsync(Guid materialId, Guid depositoId, string? batchNumber = null)
        {
            var levels = await _stockLevelRepo.GetAllAsync();
            var level = levels.FirstOrDefault(x => 
                x.MaterialId == materialId && 
                x.DepositoId == depositoId && 
                x.BatchNumber == batchNumber);
            
            return level?.Quantity ?? 0;
        }

        public async Task<IEnumerable<StockLevelDto>> GetStockByMaterialAsync(Guid materialId)
        {
            var levels = await _stockLevelRepo.GetAllAsync();
            // In a real scenario, use Include/ProjectTo for performance
            var materialLevels = levels.Where(x => x.MaterialId == materialId).ToList();

            var dtos = new List<StockLevelDto>();
            foreach (var level in materialLevels)
            {
                // Fetch related names (Optimization: Use a better query strategy in future)
                var material = await _materialRepo.GetByIdAsync(level.MaterialId);
                var deposito = await _depositoRepo.GetByIdAsync(level.DepositoId);

                dtos.Add(new StockLevelDto
                {
                    Id = level.Id,
                    MaterialId = level.MaterialId,
                    MaterialName = material?.Description ?? "Unknown",
                    DepositoId = level.DepositoId,
                    DepositoName = deposito?.Descricao ?? "Unknown",
                    BatchNumber = level.BatchNumber,
                    Quantity = level.Quantity,
                    LastUpdated = level.LastUpdated
                });
            }
            return dtos;
        }

        public async Task<IEnumerable<StockLevelDto>> GetAllStocksAsync()
        {
            var levels = await _stockLevelRepo.GetAllAsync();
            var dtos = new List<StockLevelDto>();
            
            // Performance note: use explicit loading or optimized query mechanism in future
            foreach (var level in levels)
            {
                var material = await _materialRepo.GetByIdAsync(level.MaterialId);
                var deposito = await _depositoRepo.GetByIdAsync(level.DepositoId);

                dtos.Add(new StockLevelDto
                {
                    Id = level.Id,
                    MaterialId = level.MaterialId,
                    MaterialName = material?.Description ?? "Unknown",
                    DepositoId = level.DepositoId,
                    DepositoName = deposito?.Descricao ?? "Unknown",
                    BatchNumber = level.BatchNumber,
                    Quantity = level.Quantity,
                    LastUpdated = level.LastUpdated
                });
            }
            return dtos;
        }

        public async Task AddStockMovementAsync(CreateStockMovementDto dto)
        {
            // 1. Register Movement
            var movement = new StockMovement(
                dto.MaterialId, 
                dto.DepositoId, 
                dto.Type, 
                dto.Quantity, 
                dto.ReferenceDocument, 
                dto.BatchNumber);
            
            await _stockMovementRepo.AddAsync(movement);

            // 2. Update Stock Level
            var levels = await _stockLevelRepo.GetAllAsync();
            var level = levels.FirstOrDefault(x => 
                x.MaterialId == dto.MaterialId && 
                x.DepositoId == dto.DepositoId && 
                x.BatchNumber == dto.BatchNumber);

            if (level == null)
            {
                // Logic check: Cannot remove from non-existent stock, unless allowing negative?
                // Let's prevent negative creation for now
                if (IsOutgoing(dto.Type) && dto.Quantity > 0)
                {
                    // If outgoing, we might throw exception or allow negative. 
                    // Domain entity throws if insufficient, so we need to create it with 0 if possible or fail.
                    // Let's assume we create with 0 then try to remove? 
                    level = new StockLevel(dto.MaterialId, dto.DepositoId, 0, dto.BatchNumber);
                    await _stockLevelRepo.AddAsync(level);
                }
                else
                {
                    level = new StockLevel(dto.MaterialId, dto.DepositoId, 0, dto.BatchNumber);
                    await _stockLevelRepo.AddAsync(level);
                }
            }

            if (IsOutgoing(dto.Type))
            {
                level.RemoveQuantity(dto.Quantity);
            }
            else
            {
                level.AddQuantity(dto.Quantity);
            }

            await _stockLevelRepo.UpdateAsync(level);
        }

        private bool IsOutgoing(StockMovementType type)
        {
            return type == StockMovementType.Out;
        }
    }
}
