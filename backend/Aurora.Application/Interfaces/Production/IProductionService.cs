using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Aurora.Domain.Enums;

namespace Aurora.Application.Interfaces.Production
{
    public interface IProductionService
    {
        // Work Centers
        Task<IEnumerable<WorkCenterDto>> GetWorkCentersAsync();
        Task<WorkCenterDto> GetWorkCenterByIdAsync(Guid id);
        Task<WorkCenterDto> CreateWorkCenterAsync(CreateWorkCenterDto dto);

        // BOMs
        Task<IEnumerable<BillOfMaterialDto>> GetBOMsAsync();
        Task<BillOfMaterialDto> GetBOMByIdAsync(Guid id);
        Task<BillOfMaterialDto> CreateBOMAsync(CreateBillOfMaterialDto dto);

        // Production Orders
        Task<IEnumerable<ProductionOrderDto>> GetOrdersAsync();
        Task<ProductionOrderDto> GetOrderByIdAsync(Guid id);
        Task<ProductionOrderDto> CreateOrderAsync(CreateProductionOrderDto dto);
        Task ReleaseOrderAsync(Guid id);
        Task ConfirmOrderAsync(Guid id); // Backflush logic
    }

    public class WorkCenterDto
    {
        public Guid Id { get; set; }
        public string Name { get; set; }
        public string Code { get; set; }
        public bool IsActive { get; set; }
        public Guid? CostCenterId { get; set; }
    }

    public class CreateWorkCenterDto
    {
        public string Name { get; set; }
        public string Code { get; set; }
        public Guid? CostCenterId { get; set; }
    }

    public class BillOfMaterialDto
    {
        public Guid Id { get; set; }
        public Guid ProductId { get; set; }
        public string ProductName { get; set; }
        public string Description { get; set; }
        public decimal BaseQuantity { get; set; }
        public List<BillOfMaterialItemDto> Items { get; set; } = new();
    }

    public class BillOfMaterialItemDto
    {
        public Guid Id { get; set; }
        public Guid ComponentId { get; set; }
        public string ComponentName { get; set; }
        public decimal Quantity { get; set; }
    }

    public class CreateBillOfMaterialDto
    {
        public Guid ProductId { get; set; }
        public string Description { get; set; }
        public decimal BaseQuantity { get; set; }
        public List<CreateBillOfMaterialItemDto> Items { get; set; } = new();
    }

    public class CreateBillOfMaterialItemDto
    {
        public Guid ComponentId { get; set; }
        public decimal Quantity { get; set; }
    }

    public class ProductionOrderDto
    {
        public Guid Id { get; set; }
        public string OrderNumber { get; set; }
        public Guid ProductId { get; set; }
        public string ProductName { get; set; }
        public decimal Quantity { get; set; }
        public ProductionOrderStatus Status { get; set; }
        public DateTime StartDate { get; set; }
        public DateTime EndDate { get; set; }
        public Guid? WorkCenterId { get; set; }
        public string WorkCenterName { get; set; }
    }

    public class CreateProductionOrderDto
    {
        public Guid ProductId { get; set; }
        public decimal Quantity { get; set; }
        public DateTime StartDate { get; set; }
        public DateTime EndDate { get; set; }
        public Guid? WorkCenterId { get; set; }
    }
}
