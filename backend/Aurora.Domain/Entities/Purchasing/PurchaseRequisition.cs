using System;
using System.Collections.Generic;
using Aurora.Domain.Common;
using Aurora.Domain.Enums;
using Aurora.Domain.Entities.Organization;

namespace Aurora.Domain.Entities.Purchasing
{
    public class PurchaseRequisition : BaseEntity
    {
        public string RequisitionNumber { get; private set; }
        public DateTime RequestDate { get; private set; }
        public DateTime RequiredDate { get; private set; }
        public string Requester { get; private set; } // Could be User ID later
        public PurchasingStatus Status { get; private set; }
        public string? Notes { get; private set; }

        private readonly List<PurchaseRequisitionItem> _items = new();
        public IReadOnlyCollection<PurchaseRequisitionItem> Items => _items.AsReadOnly();

        public PurchaseRequisition(string requisitionNumber, DateTime requiredDate, string requester)
        {
            RequisitionNumber = requisitionNumber;
            RequestDate = DateTime.Now;
            RequiredDate = requiredDate;
            Requester = requester;
            Status = PurchasingStatus.Draft;
        }

        public void AddItem(Guid materialId, decimal quantity, Guid? costCenterId = null)
        {
            _items.Add(new PurchaseRequisitionItem(Id, materialId, quantity, costCenterId));
        }

        public void Approve()
        {
            if (Status == PurchasingStatus.PendingApproval || Status == PurchasingStatus.Draft)
            {
                Status = PurchasingStatus.Approved;
            }
        }
        
        public void SubmitForApproval()
        {
             if (Status == PurchasingStatus.Draft)
            {
                Status = PurchasingStatus.PendingApproval;
            }
        }

        public void Complete()
        {
            Status = PurchasingStatus.Completed;
        }
        
        public void Reject()
        {
             Status = PurchasingStatus.Rejected;
        }

        private PurchaseRequisition() { }
    }
}
