using System;
using System.Collections.Generic;
using Aurora.Domain.Common;
using Aurora.Domain.Enums;
using Aurora.Domain.Entities.Organization;

namespace Aurora.Domain.Entities.Logistics
{
    public class InventoryDocument : BaseEntity
    {
         public string Description { get; private set; }
         public DateTime PlanDate { get; private set; }
         public InventoryStatus Status { get; private set; }
         public bool PostingBlock { get; private set; }
         
         public Guid DepositoId { get; private set; }
         public Deposito Deposito { get; private set; }

         public List<InventoryDocumentItem> Items { get; private set; } = new();

         private InventoryDocument() { }

         public InventoryDocument(string description, DateTime planDate, Guid depositoId, bool postingBlock)
         {
             Description = description;
             PlanDate = planDate;
             DepositoId = depositoId;
             PostingBlock = postingBlock;
             Status = InventoryStatus.Created;
         }

         public void AddItem(Guid materialId, Guid? batchId, decimal snapshotQuantity)
         {
             if (Items.Any(i => i.MaterialId == materialId && i.BatchId == batchId))
                throw new InvalidOperationException("Material/Batch already in inventory document.");

             Items.Add(new InventoryDocumentItem(Id, materialId, batchId, snapshotQuantity));
         }

        public void StartCount()
        {
            if (Status != InventoryStatus.Created) throw new InvalidOperationException("Invalid status transition.");
            Status = InventoryStatus.InCount;
        }

         public void FinishCount()
         {
             if (Status != InventoryStatus.InCount) throw new InvalidOperationException("Invalid status transition.");
             Status = InventoryStatus.Counted;
         }

         public void PostDifference()
         {
             if (Status != InventoryStatus.Counted) throw new InvalidOperationException("Invalid status transition.");
             Status = InventoryStatus.Posted;
         }
    }
}
