using System;
using Aurora.Domain.Common;
using Aurora.Domain.Entities.Logistics;

namespace Aurora.Domain.Entities.Logistics
{
    public class InventoryDocumentItem : BaseEntity
    {
        public Guid InventoryDocumentId { get; private set; }
        public InventoryDocument InventoryDocument { get; private set; }

        public Guid MaterialId { get; private set; }
        public Material Material { get; private set; }

        public Guid? BatchId { get; private set; }
        public Batch? Batch { get; private set; }

        public decimal SnapshotQuantity { get; private set; } // Book quantity at creation
        public decimal? CountedQuantity { get; private set; }
        public bool IsZeroCount { get; private set; }
        public decimal? Difference { get; private set; }

        private InventoryDocumentItem() { }

        public InventoryDocumentItem(Guid inventoryDocumentId, Guid materialId, Guid? batchId, decimal snapshotQuantity)
        {
            InventoryDocumentId = inventoryDocumentId;
            MaterialId = materialId;
            BatchId = batchId;
            SnapshotQuantity = snapshotQuantity;
        }

        public void SetCount(decimal quantity, bool isZeroCount)
        {
            CountedQuantity = quantity;
            IsZeroCount = isZeroCount;
            Difference = CountedQuantity - SnapshotQuantity;
        }
    }
}
