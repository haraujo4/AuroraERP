using System;
using System.Collections.Generic;
using System.Linq;
using Aurora.Domain.Common;
using Aurora.Domain.Entities.BusinessPartners;
using Aurora.Domain.Enums;

namespace Aurora.Domain.Entities.Finance
{
    public class Invoice : BaseEntity
    {
        public string Number { get; private set; }
        public Guid BusinessPartnerId { get; private set; }
        public BusinessPartner BusinessPartner { get; private set; }

        public InvoiceType Type { get; private set; }
        public InvoiceStatus Status { get; private set; }
        public DateTime IssueDate { get; private set; }
        public DateTime DueDate { get; private set; }
        
        public decimal GrossAmount { get; private set; }
        public decimal TaxAmount { get; private set; }
        public decimal NetAmount { get; private set; }

        public Guid? PurchaseOrderId { get; private set; }
        public Guid? SalesOrderId { get; private set; }

        private readonly List<InvoiceItem> _items = new();
        public IReadOnlyCollection<InvoiceItem> Items => _items.AsReadOnly();

        public Invoice(string number, Guid businessPartnerId, InvoiceType type, DateTime issueDate, DateTime dueDate)
        {
            Number = number;
            BusinessPartnerId = businessPartnerId;
            Type = type;
            IssueDate = issueDate;
            DueDate = dueDate;
            Status = InvoiceStatus.Draft;
        }

        // EF Core Constructor
        private Invoice() { }

        public void AddItem(string description, decimal quantity, decimal unitPrice, decimal taxAmount = 0)
        {
            if (Status != InvoiceStatus.Draft)
                throw new InvalidOperationException("Cannot add items to a non-draft invoice.");

            var item = new InvoiceItem(Id, description, quantity, unitPrice, taxAmount);
            _items.Add(item);
            RecalculateTotals();
        }

        public void RemoveItem(Guid itemId)
        {
            if (Status != InvoiceStatus.Draft)
                throw new InvalidOperationException("Cannot remove items from a non-draft invoice.");

            var item = _items.FirstOrDefault(x => x.Id == itemId);
            if (item != null)
            {
                _items.Remove(item);
                RecalculateTotals();
            }
        }

        private void RecalculateTotals()
        {
            GrossAmount = _items.Sum(i => i.TotalAmount);
            TaxAmount = _items.Sum(i => i.TaxAmount);
            NetAmount = GrossAmount - TaxAmount;
        }

        public void MarkAsPosted()
        {
            if (Status != InvoiceStatus.Draft)
                throw new InvalidOperationException("Invoice is not in Draft status.");
            
            if (!_items.Any())
                throw new InvalidOperationException("Cannot post an empty invoice.");

            Status = InvoiceStatus.Posted;
        }

        public void MarkAsPaid()
        {
            if (Status != InvoiceStatus.Posted)
                throw new InvalidOperationException("Invoice must be Posted before it can be Paid.");
            
            Status = InvoiceStatus.Paid;
        }

        public void Cancel()
        {
            if (Status == InvoiceStatus.Paid)
                throw new InvalidOperationException("Cannot cancel a paid invoice.");
            
            Status = InvoiceStatus.Cancelled;
        }

        public void SetReferences(Guid? purchaseOrderId, Guid? salesOrderId)
        {
            PurchaseOrderId = purchaseOrderId;
            SalesOrderId = salesOrderId;
        }
    }
}
