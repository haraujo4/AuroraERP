using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Aurora.Application.DTOs.Logistics;
using Aurora.Application.Interfaces.Logistics;
using Aurora.Application.Interfaces.Repositories;
using Aurora.Domain.Entities.Logistics;
using Aurora.Domain.Enums;
using Aurora.Application.Interfaces.Finance;

namespace Aurora.Application.Services.Logistics
{
    public class InventoryService : IInventoryService
    {
        private readonly IRepository<StockLevel> _stockLevelRepo;
        private readonly IRepository<StockMovement> _stockMovementRepo;
        private readonly IRepository<Aurora.Domain.Entities.Logistics.Material> _materialRepo;
        private readonly IRepository<Aurora.Domain.Entities.Organization.Deposito> _depositoRepo;
        private readonly IRepository<Aurora.Domain.Entities.Finance.Account> _accountRepo;
        private readonly IJournalEntryService _journalEntryService;

        public InventoryService(
            IRepository<StockLevel> stockLevelRepo,
            IRepository<StockMovement> stockMovementRepo,
            IRepository<Aurora.Domain.Entities.Logistics.Material> materialRepo,
            IRepository<Aurora.Domain.Entities.Organization.Deposito> depositoRepo,
            IRepository<Aurora.Domain.Entities.Finance.Account> accountRepo,
            IJournalEntryService journalEntryService)
        {
            _stockLevelRepo = stockLevelRepo;
            _stockMovementRepo = stockMovementRepo;
            _materialRepo = materialRepo;
            _depositoRepo = depositoRepo;
            _accountRepo = accountRepo;
            _journalEntryService = journalEntryService;
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
            var materials = await _materialRepo.GetAllAsync();
            var depositos = await _depositoRepo.GetAllAsync();

            return levels
                .Where(x => x.MaterialId == materialId)
                .Select(x => new StockLevelDto
                {
                    Id = x.Id,
                    MaterialId = x.MaterialId,
                    MaterialName = materials.FirstOrDefault(m => m.Id == x.MaterialId)?.Description ?? "Unknown",
                    DepositoId = x.DepositoId,
                    DepositoName = depositos.FirstOrDefault(d => d.Id == x.DepositoId)?.Descricao ?? "Unknown",
                    BatchNumber = x.BatchNumber,
                    Quantity = x.Quantity,
                    AverageUnitCost = x.AverageUnitCost,
                    LastUpdated = x.UpdatedAt ?? x.CreatedAt
                });
        }

        public async Task<IEnumerable<StockLevelDto>> GetAllStocksAsync()
        {
            var levels = await _stockLevelRepo.GetAllAsync();
            var materials = await _materialRepo.GetAllAsync();
            var depositos = await _depositoRepo.GetAllAsync();

            return levels.Select(x => new StockLevelDto
            {
                Id = x.Id,
                MaterialId = x.MaterialId,
                MaterialName = materials.FirstOrDefault(m => m.Id == x.MaterialId)?.Description ?? "Unknown",
                DepositoId = x.DepositoId,
                DepositoName = depositos.FirstOrDefault(d => d.Id == x.DepositoId)?.Descricao ?? "Unknown",
                BatchNumber = x.BatchNumber,
                Quantity = x.Quantity,
                AverageUnitCost = x.AverageUnitCost,
                LastUpdated = x.UpdatedAt ?? x.CreatedAt
            });
        }

        public async Task AddStockMovementAsync(CreateStockMovementDto dto)
        {
            // 1. Update Stock Level & Recalculate Cost
            var levels = await _stockLevelRepo.GetAllAsync();
            var level = levels.FirstOrDefault(x => 
                x.MaterialId == dto.MaterialId && 
                x.DepositoId == dto.DepositoId && 
                x.BatchNumber == dto.BatchNumber);

            if (level == null)
            {
                level = new StockLevel(dto.MaterialId, dto.DepositoId, 0, dto.UnitPrice, dto.BatchNumber);
                await _stockLevelRepo.AddAsync(level);
            }

            decimal movementUnitPrice = dto.UnitPrice;

            if (IsOutgoing(dto.Type))
            {
                movementUnitPrice = level.AverageUnitCost;
                level.RemoveQuantity(dto.Quantity);
            }
            else
            {
                level.UpdateCost(dto.Quantity, dto.UnitPrice);
                level.AddQuantity(dto.Quantity);
            }

            await _stockLevelRepo.UpdateAsync(level);

            // 2. Register Movement
            var movement = new StockMovement(
                dto.MaterialId, 
                dto.DepositoId, 
                dto.Type, 
                dto.Quantity, 
                movementUnitPrice,
                dto.ReferenceDocument, 
                dto.BatchNumber);
            
            await _stockMovementRepo.AddAsync(movement);

            // 3. Automated Accounting Integration (Bookkeeping)
            await CreateAccountingEntryAsync(dto, movementUnitPrice);
        }

        private async Task CreateAccountingEntryAsync(CreateStockMovementDto dto, decimal unitPrice)
        {
            try 
            {
                var accounts = await _accountRepo.GetAllAsync();
                var inventoryAcct = accounts.FirstOrDefault(a => a.Code == "1.1.01");
                var grirAcct = accounts.FirstOrDefault(a => a.Code == "2.1.01");
                var cogsAcct = accounts.FirstOrDefault(a => a.Code == "3.1.01");

                if (inventoryAcct == null) return; // Silent skip if accounts not seeded yet

                var totalValue = dto.Quantity * unitPrice;
                var material = await _materialRepo.GetByIdAsync(dto.MaterialId);
                
                var journalEntryDto = new CreateJournalEntryDto
                {
                    PostingDate = DateTime.UtcNow,
                    DocumentDate = DateTime.UtcNow,
                    Description = $"Stock {dto.Type}: {material?.Description} - {dto.ReferenceDocument}",
                    Reference = dto.ReferenceDocument
                };

                if (dto.Type == StockMovementType.In)
                {
                    // Debit: Inventory, Credit: GR/IR
                    journalEntryDto.Lines.Add(new CreateJournalEntryLineDto { AccountId = inventoryAcct.Id, Amount = totalValue, Type = "Debit" });
                    if (grirAcct != null)
                        journalEntryDto.Lines.Add(new CreateJournalEntryLineDto { AccountId = grirAcct.Id, Amount = totalValue, Type = "Credit" });
                }
                else if (dto.Type == StockMovementType.Out)
                {
                    // Debit: COGS, Credit: Inventory
                    if (cogsAcct != null)
                        journalEntryDto.Lines.Add(new CreateJournalEntryLineDto { AccountId = cogsAcct.Id, Amount = totalValue, Type = "Debit" });
                    journalEntryDto.Lines.Add(new CreateJournalEntryLineDto { AccountId = inventoryAcct.Id, Amount = totalValue, Type = "Credit" });
                }

                if (journalEntryDto.Lines.Count >= 2)
                {
                    var entry = await _journalEntryService.CreateAsync(journalEntryDto);
                    await _journalEntryService.PostAsync(entry.Id);
                }
            }
            catch (Exception ex)
            {
                // In a production system, we'd log this and potentially use a background worker
                Console.WriteLine($"Accounting integration failed: {ex.Message}");
            }
        }

        public async Task TransferStockAsync(TransferStockDto dto)
        {
            // Note: For true atomicity, use a database transaction.
            // Simplified for MVP.
            
            // 1. Out from Source
            await AddStockMovementAsync(new CreateStockMovementDto
            {
                MaterialId = dto.MaterialId,
                DepositoId = dto.SourceDepositoId,
                Type = StockMovementType.Out,
                Quantity = dto.Quantity,
                BatchNumber = dto.BatchNumber,
                ReferenceDocument = dto.ReferenceDocument
            });

            // 2. In to Destination
            await AddStockMovementAsync(new CreateStockMovementDto
            {
                MaterialId = dto.MaterialId,
                DepositoId = dto.DestinationDepositoId,
                Type = StockMovementType.In,
                Quantity = dto.Quantity,
                BatchNumber = dto.BatchNumber,
                ReferenceDocument = dto.ReferenceDocument
            });
        }

        private bool IsOutgoing(StockMovementType type)
        {
            return type == StockMovementType.Out;
        }
    }
}
