using System;
using Aurora.Domain.Common;
using Aurora.Domain.Entities.Organization;

namespace Aurora.Domain.Entities.Logistics
{
    public class StockLevel : BaseEntity
    {
        public Guid MaterialId { get; private set; }
        public Material Material { get; private set; }

        public Guid DepositoId { get; private set; }
        public Deposito Deposito { get; private set; }

        public string? BatchNumber { get; private set; }
        public decimal Quantity { get; private set; }
        public decimal AverageUnitCost { get; private set; }
        public DateTime LastUpdated { get; private set; }

        private StockLevel() { }

        public StockLevel(Guid materialId, Guid depositoId, decimal quantity, decimal averageUnitCost = 0, string? batchNumber = null)
        {
            MaterialId = materialId;
            DepositoId = depositoId;
            Quantity = quantity;
            AverageUnitCost = averageUnitCost;
            BatchNumber = batchNumber;
            LastUpdated = DateTime.UtcNow;
        }

        public void AddQuantity(decimal quantity)
        {
            Quantity += quantity;
            LastUpdated = DateTime.UtcNow;
        }

        public void RemoveQuantity(decimal quantity)
        {
            if (Quantity < quantity)
                throw new InvalidOperationException("Insufficient stock.");
            
            Quantity -= quantity;
            LastUpdated = DateTime.UtcNow;
        }

        public void UpdateCost(decimal newQuantity, decimal unitCost)
        {
            if (newQuantity <= 0) return;

            // Moving Average Formula: ((OldQty * OldCost) + (NewQty * NewCost)) / (OldQty + NewQty)
            var totalValue = (Quantity * AverageUnitCost) + (newQuantity * unitCost);
            var totalQuantity = Quantity + newQuantity;

            AverageUnitCost = totalValue / totalQuantity;
        }
    }
}
