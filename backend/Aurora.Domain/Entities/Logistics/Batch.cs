using System;
using Aurora.Domain.Common;

namespace Aurora.Domain.Entities.Logistics
{
    public enum BatchStatus
    {
        Unrestricted = 0,
        Restricted = 1,
        Blocked = 2
    }

    public class Batch : BaseEntity
    {
        public Guid MaterialId { get; private set; }
        public Material Material { get; private set; }

        public string BatchNumber { get; private set; }
        public DateTime? ManufacturingDate { get; private set; }
        public DateTime? ExpirationDate { get; private set; }
        public string? SupplierBatchNumber { get; private set; }
        public BatchStatus Status { get; private set; } = BatchStatus.Unrestricted;

        private Batch() { }

        public Batch(Guid materialId, string batchNumber, DateTime? manufacturingDate, DateTime? expirationDate, string? supplierBatchNumber = null)
        {
            MaterialId = materialId;
            BatchNumber = batchNumber;
            ManufacturingDate = manufacturingDate;
            ExpirationDate = expirationDate;
            SupplierBatchNumber = supplierBatchNumber;
            Status = BatchStatus.Unrestricted;
        }

        public void UpdateStatus(BatchStatus status)
        {
            Status = status;
        }

        public void SetDates(DateTime? manufacturingDate, DateTime? expirationDate)
        {
            ManufacturingDate = manufacturingDate;
            ExpirationDate = expirationDate;
        }
    }
}
