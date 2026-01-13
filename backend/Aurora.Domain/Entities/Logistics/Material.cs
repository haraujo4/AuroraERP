using System;
using Aurora.Domain.Common;
using Aurora.Domain.Enums;

namespace Aurora.Domain.Entities.Logistics
{
    public class Material : BaseEntity
    {
        // Basic Data
        public string Code { get; private set; }
        public string Description { get; private set; }
        public string Type { get; private set; } // Raw, Finished, Service, Asset
        public string Group { get; private set; } // Material Group
        public string UnitOfMeasure { get; private set; } // Base Unit

        // Logistics
        public decimal? NetWeight { get; private set; }
        public decimal? GrossWeight { get; private set; }
        public string? WeightUnit { get; private set; } // KG, LB
        public decimal? Width { get; private set; }
        public decimal? Height { get; private set; }
        public decimal? Length { get; private set; }
        public string? DimensionUnit { get; private set; } // CM, M, IN
        public decimal MinStock { get; private set; }
        public decimal MaxStock { get; private set; }

        // Sales
        public decimal BasePrice { get; private set; }
        public string? SalesUnit { get; private set; }
        public string? TaxClassification { get; private set; } // NCM, HS Code

        // Purchasing
        public decimal? StandardCost { get; private set; }
        public string? PurchasingUnit { get; private set; }

        // Planning
        public ProcurementType ProcurementType { get; private set; } = ProcurementType.Buy;
        public int LeadTimeDays { get; private set; }
        public decimal SafetyStock { get; private set; }

        // Control
        public bool IsBatchManaged { get; private set; }
        public bool IsSerialManaged { get; private set; }
        public bool IsActive { get; private set; } = true;

        private Material() { }

        public Material(string code, string description, string unitOfMeasure, decimal basePrice, string type)
        {
            Code = code;
            Description = description;
            UnitOfMeasure = unitOfMeasure;
            BasePrice = basePrice;
            Type = type;
            IsActive = true;
        }

        public void UpdateBasicData(string description, string type, string group, string unitOfMeasure)
        {
            Description = description;
            Type = type;
            Group = group;
            UnitOfMeasure = unitOfMeasure;
        }

        public void UpdateLogisticsData(decimal? netWeight, decimal? grossWeight, string? weightUnit, 
                                      decimal? width, decimal? height, decimal? length, string? dimensionUnit,
                                      decimal minStock, decimal maxStock)
        {
            NetWeight = netWeight;
            GrossWeight = grossWeight;
            WeightUnit = weightUnit;
            Width = width;
            Height = height;
            Length = length;
            DimensionUnit = dimensionUnit;
            MinStock = minStock;
            MaxStock = maxStock;
        }

        public void UpdateSalesData(decimal basePrice, string? salesUnit, string? taxClassification)
        {
            BasePrice = basePrice;
            SalesUnit = salesUnit;
            TaxClassification = taxClassification;
        }

        public void UpdatePurchasingData(decimal? standardCost, string? purchasingUnit)
        {
            StandardCost = standardCost;
            PurchasingUnit = purchasingUnit;
        }

        public void UpdateControlData(bool isBatchManaged, bool isSerialManaged)
        {
            IsBatchManaged = isBatchManaged;
            IsSerialManaged = isSerialManaged;
        }

        public void UpdatePlanningData(ProcurementType procurementType, int leadTimeDays, decimal safetyStock)
        {
            ProcurementType = procurementType;
            LeadTimeDays = leadTimeDays;
            SafetyStock = safetyStock;
        }
    }
}
