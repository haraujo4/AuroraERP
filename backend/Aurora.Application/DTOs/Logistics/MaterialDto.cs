using System;

namespace Aurora.Application.DTOs.Logistics
{
    public class MaterialDto
    {
        public Guid Id { get; set; }
        // Basic Data
        public string Code { get; set; }
        public string Description { get; set; }
        public string Type { get; set; }
        public string Group { get; set; }
        public string UnitOfMeasure { get; set; }

        // Logistics
        public decimal? NetWeight { get; set; }
        public decimal? GrossWeight { get; set; }
        public string? WeightUnit { get; set; }
        public decimal? Width { get; set; }
        public decimal? Height { get; set; }
        public decimal? Length { get; set; }
        public string? DimensionUnit { get; set; }
        public decimal MinStock { get; set; }
        public decimal MaxStock { get; set; }

        // Sales
        public decimal BasePrice { get; set; }
        public string? SalesUnit { get; set; }
        public string? TaxClassification { get; set; } // NCM

        // Purchasing
        public decimal? StandardCost { get; set; }
        public string? PurchasingUnit { get; set; }

        // Control
        public bool IsBatchManaged { get; set; }
        public bool IsSerialManaged { get; set; }
    }

    public class CreateMaterialDto
    {
        public string Code { get; set; }
        public string Description { get; set; }
        public string Type { get; set; }
        public string Group { get; set; }
        public string UnitOfMeasure { get; set; }

        // Logistics
        public decimal? NetWeight { get; set; }
        public decimal? GrossWeight { get; set; }
        public string? WeightUnit { get; set; }
        public decimal? Width { get; set; }
        public decimal? Height { get; set; }
        public decimal? Length { get; set; }
        public string? DimensionUnit { get; set; }
        public decimal MinStock { get; set; }
        public decimal MaxStock { get; set; }

        // Sales
        public decimal BasePrice { get; set; }
        public string? SalesUnit { get; set; }
        public string? TaxClassification { get; set; }

        // Purchasing
        public decimal? StandardCost { get; set; }
        public string? PurchasingUnit { get; set; }

        // Control
        public bool IsBatchManaged { get; set; }
        public bool IsSerialManaged { get; set; }
    }
    public class UpdateMaterialDto : CreateMaterialDto
    {
    }
}
