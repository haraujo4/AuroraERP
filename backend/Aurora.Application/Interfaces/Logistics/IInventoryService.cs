using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Aurora.Application.DTOs.Logistics;
using Aurora.Domain.Enums;

namespace Aurora.Application.Interfaces.Logistics
{
    public interface IInventoryService
    {
        Task<decimal> GetStockLevelAsync(Guid materialId, Guid depositoId, string? batchNumber = null);
        Task<IEnumerable<StockLevelDto>> GetStockByMaterialAsync(Guid materialId);
        Task<IEnumerable<StockLevelDto>> GetAllStocksAsync();
        Task AddStockMovementAsync(CreateStockMovementDto dto);
        Task TransferStockAsync(TransferStockDto dto);
    }

    public class StockLevelDto
    {
        public Guid Id { get; set; }
        public Guid MaterialId { get; set; }
        public string MaterialName { get; set; }
        public Guid DepositoId { get; set; }
        public string DepositoName { get; set; }
        public string? BatchNumber { get; set; }
        public Guid? BatchId { get; set; }
        public decimal Quantity { get; set; }
        public decimal AverageUnitCost { get; set; }
        public DateTime LastUpdated { get; set; }
    }

    public class CreateStockMovementDto
    {
        public Guid MaterialId { get; set; }
        public Guid DepositoId { get; set; }
        public StockMovementType Type { get; set; }
        public decimal Quantity { get; set; }
        public decimal UnitPrice { get; set; }
        public string? BatchNumber { get; set; }
        public Guid? BatchId { get; set; }
        public DateTime? ManufacturingDate { get; set; }
        public DateTime? ExpirationDate { get; set; }
        public string ReferenceDocument { get; set; }
    }
}
