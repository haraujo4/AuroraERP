using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Aurora.Application.Interfaces.Logistics;
using Aurora.Application.Interfaces.Production;
using Aurora.Application.Interfaces.Repositories;
using Aurora.Domain.Entities.Production;
using Aurora.Domain.Enums;

namespace Aurora.Application.Services.Production
{
    public class ProductionService : IProductionService
    {
        private readonly IRepository<WorkCenter> _workCenterRepository;
        private readonly IRepository<BillOfMaterial> _bomRepository;
        private readonly IRepository<ProductionOrder> _orderRepository;
        private readonly IProductionRepository _productionRepository; // Custom repository
        private readonly IInventoryService _inventoryService;

        public ProductionService(
            IRepository<WorkCenter> workCenterRepository,
            IRepository<BillOfMaterial> bomRepository,
            IRepository<ProductionOrder> orderRepository,
            IProductionRepository productionRepository,
            IInventoryService inventoryService)
        {
            _workCenterRepository = workCenterRepository;
            _bomRepository = bomRepository;
            _orderRepository = orderRepository;
            _productionRepository = productionRepository;
            _inventoryService = inventoryService;
        }

        // Work Centers
        public async Task<IEnumerable<WorkCenterDto>> GetWorkCentersAsync()
        {
            var list = await _workCenterRepository.GetAllAsync();
            return list.Select(w => new WorkCenterDto
            {
                Id = w.Id,
                Name = w.Name,
                Code = w.Code,
                IsActive = w.IsActive,
                CostCenterId = w.CostCenterId
            }).ToList();
        }

        public async Task<WorkCenterDto> GetWorkCenterByIdAsync(Guid id)
        {
            var w = await _workCenterRepository.GetByIdAsync(id);
            if (w == null) return null;
            return new WorkCenterDto
            {
                Id = w.Id,
                Name = w.Name,
                Code = w.Code,
                IsActive = w.IsActive,
                CostCenterId = w.CostCenterId
            };
        }

        public async Task<WorkCenterDto> CreateWorkCenterAsync(CreateWorkCenterDto dto)
        {
            var entity = new WorkCenter(dto.Name, dto.Code, dto.CostCenterId);
            await _workCenterRepository.AddAsync(entity);
            return await GetWorkCenterByIdAsync(entity.Id);
        }

        // BOMs
        public async Task<IEnumerable<BillOfMaterialDto>> GetBOMsAsync()
        {
            var list = await _productionRepository.GetBOMsWithProductAsync();

            return list.Select(b => new BillOfMaterialDto
            {
                Id = b.Id,
                ProductId = b.ProductId,
                ProductName = b.Product?.Description ?? "Unknown",
                Description = b.Description,
                BaseQuantity = b.BaseQuantity,
                Items = new List<BillOfMaterialItemDto>()
            }).ToList();
        }

        public async Task<BillOfMaterialDto> GetBOMByIdAsync(Guid id)
        {
            var b = await _productionRepository.GetBOMWithItemsAsync(id);

            if (b == null) return null;

            return new BillOfMaterialDto
            {
                Id = b.Id,
                ProductId = b.ProductId,
                ProductName = b.Product?.Description ?? "Unknown",
                Description = b.Description,
                BaseQuantity = b.BaseQuantity,
                Items = b.Items.Select(i => new BillOfMaterialItemDto
                {
                    Id = i.Id,
                    ComponentId = i.ComponentId,
                    ComponentName = i.Component?.Description ?? "Unknown",
                    Quantity = i.Quantity
                }).ToList()
            };
        }

        public async Task<BillOfMaterialDto> CreateBOMAsync(CreateBillOfMaterialDto dto)
        {
            var entity = new BillOfMaterial(dto.ProductId, dto.Description, dto.BaseQuantity);
            foreach (var i in dto.Items)
            {
                entity.AddItem(i.ComponentId, i.Quantity);
            }
            await _bomRepository.AddAsync(entity);
            return await GetBOMByIdAsync(entity.Id);
        }

        // Production Orders
        public async Task<IEnumerable<ProductionOrderDto>> GetOrdersAsync()
        {
            var list = await _productionRepository.GetOrdersWithDetailsAsync();

            return list.Select(o => new ProductionOrderDto
            {
                Id = o.Id,
                OrderNumber = o.OrderNumber,
                ProductId = o.ProductId,
                ProductName = o.Product?.Description ?? "Unknown",
                Quantity = o.Quantity,
                Status = o.Status,
                StartDate = o.StartDate,
                EndDate = o.EndDate,
                WorkCenterId = o.WorkCenterId,
                WorkCenterName = o.WorkCenter?.Name ?? "-"
            }).ToList();
        }

        public async Task<ProductionOrderDto> GetOrderByIdAsync(Guid id)
        {
             var o = await _productionRepository.GetOrderWithDetailsAsync(id);

             if (o == null) return null;

             return new ProductionOrderDto
            {
                Id = o.Id,
                OrderNumber = o.OrderNumber,
                ProductId = o.ProductId,
                ProductName = o.Product?.Description ?? "Unknown",
                Quantity = o.Quantity,
                Status = o.Status,
                StartDate = o.StartDate,
                EndDate = o.EndDate,
                WorkCenterId = o.WorkCenterId,
                WorkCenterName = o.WorkCenter?.Name ?? "-"
            };
        }

        public async Task<ProductionOrderDto> CreateOrderAsync(CreateProductionOrderDto dto)
        {
            var orderNumber = await _productionRepository.GenerateOrderNumberAsync();

            var entity = new ProductionOrder(orderNumber, dto.ProductId, dto.Quantity, dto.StartDate, dto.EndDate);
            if (dto.WorkCenterId.HasValue)
            {
                entity.SetWorkCenter(dto.WorkCenterId.Value);
            }
            
            await _orderRepository.AddAsync(entity);
            return await GetOrderByIdAsync(entity.Id);
        }

        public async Task ReleaseOrderAsync(Guid id)
        {
            var o = await _orderRepository.GetByIdAsync(id);
            if (o == null) throw new Exception("Order not found");
            
            o.Release();
            await _orderRepository.UpdateAsync(o);
        }

        public async Task ConfirmOrderAsync(Guid id)
        {
            var o = await _orderRepository.GetByIdAsync(id);
             if (o == null) throw new Exception("Order not found");

             if (o.Status == ProductionOrderStatus.Completed || o.Status == ProductionOrderStatus.Closed)
                 throw new Exception("Order already completed");

             // 1. Find BOM to know what to consume
             var bom = await _productionRepository.GetActiveBOMForProductAsync(o.ProductId);
             if (bom == null) throw new Exception("No active BOM found for this product. Cannot backflush components.");

            // 2. Consume Components (Backflush)
            var deposito = await _productionRepository.GetDefaultDepositoAsync();
            if (deposito == null) throw new Exception("No Warehouse configured.");

            // Ratio: OrderQty / BOM BaseQty
            decimal ratio = o.Quantity / bom.BaseQuantity;

            foreach(var item in bom.Items)
            {
                decimal quantityToConsume = item.Quantity * ratio;
                
                await _inventoryService.AddStockMovementAsync(new CreateStockMovementDto
                {
                    MaterialId = item.ComponentId,
                    DepositoId = deposito.Id,
                    Type = StockMovementType.Out, // Issue
                    Quantity = quantityToConsume,
                    ReferenceDocument = o.OrderNumber,
                    BatchNumber = null
                });
            }

            // 3. Receive Finished Good
             await _inventoryService.AddStockMovementAsync(new CreateStockMovementDto
                {
                    MaterialId = o.ProductId,
                    DepositoId = deposito.Id,
                    Type = StockMovementType.In, // Receipt
                    Quantity = o.Quantity,
                    ReferenceDocument = o.OrderNumber,
                    BatchNumber = DateTime.Now.ToString("yyyyMMdd") // Simple batch
                });

             // 4. Update Status
             o.Start(); // Ensure it was started
             o.Complete();
             await _orderRepository.UpdateAsync(o);
        }
    }
}
