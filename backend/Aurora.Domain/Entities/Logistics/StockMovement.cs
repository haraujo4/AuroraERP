using System;
using Aurora.Domain.Common;
using Aurora.Domain.Entities.Organization;
using Aurora.Domain.Enums;

namespace Aurora.Domain.Entities.Logistics
{
    public class StockMovement : BaseEntity
    {
        public Guid MaterialId { get; private set; }
        public Material Material { get; private set; }

        public Guid DepositoId { get; private set; }
        public Deposito Deposito { get; private set; }

        public StockMovementType Type { get; private set; }
        public decimal Quantity { get; private set; }
        public decimal UnitPrice { get; private set; }
        public string? BatchNumber { get; private set; }
        
        public Guid? BatchId { get; private set; }
        public Batch? Batch { get; private set; }

        public string ReferenceDocument { get; private set; } // e.g. "INV-001"
        public DateTime MovementDate { get; private set; }

        private StockMovement() { }

        public StockMovement(Guid materialId, Guid depositoId, StockMovementType type, decimal quantity, decimal unitPrice, string referenceDocument, string? batchNumber = null, Guid? batchId = null)
        {
            MaterialId = materialId;
            DepositoId = depositoId;
            Type = type;
            Quantity = quantity;
            UnitPrice = unitPrice;
            ReferenceDocument = referenceDocument;
            BatchNumber = batchNumber;
            BatchId = batchId;
            MovementDate = DateTime.UtcNow;
        }
    }
}
