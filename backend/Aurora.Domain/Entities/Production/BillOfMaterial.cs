using System;
using System.Collections.Generic;
using System.Linq;
using Aurora.Domain.Common;
using Aurora.Domain.Entities.Logistics;

namespace Aurora.Domain.Entities.Production
{
    public class BillOfMaterial : BaseEntity
    {
        public Guid ProductId { get; private set; }
        public Material Product { get; private set; }
        
        public string Description { get; private set; }
        public bool IsActive { get; private set; }
        public decimal BaseQuantity { get; private set; } // e.g. BOM for 1 unit or 100 units

        private readonly List<BillOfMaterialItem> _items = new();
        public IReadOnlyCollection<BillOfMaterialItem> Items => _items.AsReadOnly();

        public BillOfMaterial(Guid productId, string description, decimal baseQuantity = 1)
        {
            ProductId = productId;
            Description = description;
            BaseQuantity = baseQuantity;
            IsActive = true;
        }

        public void AddItem(Guid componentId, decimal quantity)
        {
            _items.Add(new BillOfMaterialItem(Id, componentId, quantity));
        }

        public void Update(string description, decimal baseQuantity)
        {
            Description = description;
            BaseQuantity = baseQuantity;
        }
        
        public void ClearItems()
        {
            _items.Clear();
        }

        private BillOfMaterial() { }
    }
}
