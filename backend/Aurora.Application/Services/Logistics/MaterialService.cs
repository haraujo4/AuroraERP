using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Aurora.Application.DTOs.Logistics;
using Aurora.Application.Interfaces.Logistics;
using Aurora.Application.Interfaces.Repositories;
using Aurora.Domain.Entities.Logistics;

namespace Aurora.Application.Services.Logistics
{
    public class MaterialService : IMaterialService
    {
        private readonly IRepository<Material> _repository;

        public MaterialService(IRepository<Material> repository)
        {
            _repository = repository;
        }

        public async Task<IEnumerable<MaterialDto>> GetAllAsync()
        {
            var materials = await _repository.GetAllAsync();
            return materials.Select(MapToDto);
        }

        public async Task<MaterialDto> GetByIdAsync(Guid id)
        {
            var m = await _repository.GetByIdAsync(id);
            if (m == null) return null;
            return MapToDto(m);
        }

        public async Task<MaterialDto> CreateAsync(CreateMaterialDto dto)
        {
            Console.WriteLine($"[MaterialService] Creating Material: Code={dto.Code}");
            Console.WriteLine($"[MaterialService] Logistics: NetWeight={dto.NetWeight}, GrossWeight={dto.GrossWeight}, Width={dto.Width}");
            Console.WriteLine($"[MaterialService] Purchasing: Cost={dto.StandardCost}, Unit={dto.PurchasingUnit}");

            // Constructor with basic data
            var material = new Material(dto.Code, dto.Description, dto.UnitOfMeasure, dto.BasePrice, dto.Type);
            
            // Enrich with additional data
            material.UpdateBasicData(dto.Description, dto.Type, dto.Group, dto.UnitOfMeasure);
            material.UpdateLogisticsData(dto.NetWeight, dto.GrossWeight, dto.WeightUnit, 
                                       dto.Width, dto.Height, dto.Length, dto.DimensionUnit,
                                       dto.MinStock, dto.MaxStock);
            material.UpdateSalesData(dto.BasePrice, dto.SalesUnit, dto.TaxClassification);
            material.UpdatePurchasingData(dto.StandardCost, dto.PurchasingUnit);
            material.UpdateControlData(dto.IsBatchManaged, dto.IsSerialManaged);

            await _repository.AddAsync(material);
            return MapToDto(material);
        }

        public async Task<MaterialDto> UpdateAsync(Guid id, UpdateMaterialDto dto)
        {
            var material = await _repository.GetByIdAsync(id);
            if (material == null) throw new Exception("Material not found");

            material.UpdateBasicData(dto.Description, dto.Type, dto.Group, dto.UnitOfMeasure);
            material.UpdateLogisticsData(dto.NetWeight, dto.GrossWeight, dto.WeightUnit,
                                       dto.Width, dto.Height, dto.Length, dto.DimensionUnit,
                                       dto.MinStock, dto.MaxStock);
            material.UpdateSalesData(dto.BasePrice, dto.SalesUnit, dto.TaxClassification);
            material.UpdatePurchasingData(dto.StandardCost, dto.PurchasingUnit);
            material.UpdateControlData(dto.IsBatchManaged, dto.IsSerialManaged);

            await _repository.UpdateAsync(material);
            return MapToDto(material);
        }

        public async Task DeleteAsync(Guid id)
        {
            await _repository.DeleteAsync(id);
        }

        private MaterialDto MapToDto(Material m)
        {
            return new MaterialDto
            {
                Id = m.Id,
                Code = m.Code,
                Description = m.Description,
                Type = m.Type,
                Group = m.Group,
                UnitOfMeasure = m.UnitOfMeasure,
                NetWeight = m.NetWeight,
                GrossWeight = m.GrossWeight,
                WeightUnit = m.WeightUnit,
                Width = m.Width,
                Height = m.Height,
                Length = m.Length,
                DimensionUnit = m.DimensionUnit,
                MinStock = m.MinStock,
                MaxStock = m.MaxStock,
                BasePrice = m.BasePrice,
                SalesUnit = m.SalesUnit,
                TaxClassification = m.TaxClassification,
                StandardCost = m.StandardCost,
                PurchasingUnit = m.PurchasingUnit,
                IsBatchManaged = m.IsBatchManaged,
                IsSerialManaged = m.IsSerialManaged
            };
        }
    }
}
