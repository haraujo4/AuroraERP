using System;
using System.Collections.Generic;
using Aurora.Domain.Common;
using Aurora.Domain.Entities.Logistics;

namespace Aurora.Domain.Entities.Sales
{
    public class PriceList : BaseEntity
    {
        public string Name { get; private set; }
        public DateTime StartDate { get; private set; }
        public DateTime EndDate { get; private set; }
        public bool IsActive { get; private set; }

        private readonly List<PriceListItem> _items = new();
        public IReadOnlyCollection<PriceListItem> Items => _items.AsReadOnly();

        public PriceList(string name, DateTime startDate, DateTime endDate)
        {
            Name = name;
            StartDate = startDate;
            EndDate = endDate;
            IsActive = true;
        }

        private PriceList() { }

        public void AddItem(Guid materialId, decimal price)
        {
            var item = new PriceListItem(Id, materialId, price);
            _items.Add(item);
        }

        public void UpdatePeriod(DateTime startDate, DateTime endDate)
        {
            StartDate = startDate;
            EndDate = endDate;
        }

        public void Deactivate() => IsActive = false;
        public void Activate() => IsActive = true;
    }

    public class PriceListItem : BaseEntity
    {
        public Guid PriceListId { get; private set; }
        public Guid MaterialId { get; private set; }
        public Material Material { get; private set; }
        public decimal Price { get; private set; }

        public PriceListItem(Guid priceListId, Guid materialId, decimal price)
        {
            PriceListId = priceListId;
            MaterialId = materialId;
            Price = price;
        }

        private PriceListItem() { }
    }
}
