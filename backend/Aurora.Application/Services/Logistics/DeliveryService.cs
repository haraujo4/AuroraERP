using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Aurora.Application.DTOs.Logistics;
using Aurora.Application.Interfaces.Logistics;
using Aurora.Application.Interfaces.Repositories;
using Aurora.Domain.Entities.Logistics;
using Aurora.Domain.Entities.Sales;
using Aurora.Application.Interfaces.Repositories.Logistics;
using Aurora.Domain.Enums;

namespace Aurora.Application.Services.Logistics
{
    public class DeliveryService : IDeliveryService
    {
        private readonly IDeliveryRepository _deliveryRepository;
        private readonly ISalesOrderRepository _salesOrderRepository;
        private readonly IInventoryService _inventoryService;
        private readonly IRepository<Material> _materialRepository;

        public DeliveryService(
            IDeliveryRepository deliveryRepository,
            ISalesOrderRepository salesOrderRepository,
            IInventoryService inventoryService,
            IRepository<Material> materialRepository)
        {
            _deliveryRepository = deliveryRepository;
            _salesOrderRepository = salesOrderRepository;
            _inventoryService = inventoryService;
            _materialRepository = materialRepository;
        }

        public async Task<DeliveryDto> CreateFromOrderAsync(Guid salesOrderId)
        {
            var order = await _salesOrderRepository.GetByIdAsync(salesOrderId);
            if (order == null) throw new KeyNotFoundException("Order not found");

            // Logic: Can only create delivery if order is Confirmed
            if (order.Status != SalesOrderStatus.Confirmed)
                throw new InvalidOperationException("Sales Order must be Confirmed to create a delivery.");

            // Generate Number (Simple logic)
            var number = "DEL-" + order.Number;

            var delivery = new Delivery(number, order.Id, DateTime.UtcNow);

            // Copy items
            foreach (var item in order.Items)
            {
                // Initial unit cost is 0, will be updated during posting with current MAC
                delivery.AddItem(item.MaterialId, item.Quantity, 0, item.Id);
            }

            await _deliveryRepository.AddAsync(delivery);

            // Update Order Status to Processing
            order.UpdateStatus(SalesOrderStatus.Processing);
            await _salesOrderRepository.UpdateAsync(order);

            return await MapToDto(delivery);
        }

        public async Task PostDeliveryAsync(Guid deliveryId)
        {
            var delivery = await _deliveryRepository.GetByIdWithDetailsAsync(deliveryId);
            if (delivery == null) throw new KeyNotFoundException("Delivery not found");

            // Post Logic
            delivery.Post();

            // Create Inventory Movements (Goods Issue)
            foreach (var item in delivery.Items)
            {
                // 1. Get current stock levels to find a warehouse and CURRENT MAC
                var stocks = await _inventoryService.GetStockByMaterialAsync(item.MaterialId);
                var validStock = stocks.FirstOrDefault(s => s.Quantity >= item.Quantity) ?? stocks.FirstOrDefault();
                
                if (validStock == null)
                {
                    throw new InvalidOperationException($"No stock found for material {item.MaterialId} to fulfill delivery.");
                }

                // 2. Update Delivery Item with the cost at the time of posting (COGS)
                decimal unitCost = validStock.AverageUnitCost;


                if (unitCost <= 0)
                {
                    // Fallback to Standard Cost
                    var material = await _materialRepository.GetByIdAsync(item.MaterialId);
                    if (material != null)
                    {
                        unitCost = material.StandardCost ?? material.BasePrice;
                    }
                }

                delivery.UpdateItemCost(item.MaterialId, unitCost);
                
                var movementDto = new CreateStockMovementDto
                {
                    MaterialId = item.MaterialId,
                    DepositoId = validStock.DepositoId,
                    Type = StockMovementType.Out,
                    Quantity = item.Quantity,
                    ReferenceDocument = delivery.Number,
                    BatchNumber = validStock.BatchNumber,
                    UnitPrice = unitCost // Pass current MAC or Fallback
                };

                await _inventoryService.AddStockMovementAsync(movementDto);
            }

            await _deliveryRepository.UpdateAsync(delivery);
            
            // Update Order Status via Repo or Service?
            // Ideally we call OrderService to update status, but Repo update is faster here for internal logic
            var order = await _salesOrderRepository.GetByIdAsync(delivery.SalesOrderId);
            if (order != null)
            {
                order.UpdateStatus(SalesOrderStatus.Shipped);
                await _salesOrderRepository.UpdateAsync(order);
            }
        }

        public async Task<IEnumerable<DeliveryDto>> GetAllAsync()
        {
            var deliveries = await _deliveryRepository.GetAllWithDetailsAsync();
            var dtos = new List<DeliveryDto>();
            foreach (var d in deliveries)
            {
                dtos.Add(await MapToDto(d));
            }
            return dtos;
        }

        public async Task<DeliveryDto> GetByIdAsync(Guid id)
        {
            var d = await _deliveryRepository.GetByIdWithDetailsAsync(id);
            if (d == null) return null;
            return await MapToDto(d);
        }

        private async Task<DeliveryDto> MapToDto(Delivery d)
        {
            // Eager load sales order number?
            var order = await _salesOrderRepository.GetByIdAsync(d.SalesOrderId);
            
            var dto = new DeliveryDto
            {
                Id = d.Id,
                Number = d.Number,
                SalesOrderId = d.SalesOrderId,
                SalesOrderNumber = order?.Number ?? "N/A",
                DeliveryDate = d.DeliveryDate,
                PostingDate = d.PostingDate,
                Status = d.Status.ToString()
            };

            foreach (var item in d.Items)
            {
                 var mat = await _materialRepository.GetByIdAsync(item.MaterialId);
                 dto.Items.Add(new DeliveryItemDto
                 {
                     Id = item.Id,
                     MaterialId = item.MaterialId,
                     MaterialName = mat?.Description ?? "Unknown",
                     Quantity = item.Quantity,
                     SalesOrderItemId = item.SalesOrderItemId
                 });
            }
            return dto;
        }
    }
}
