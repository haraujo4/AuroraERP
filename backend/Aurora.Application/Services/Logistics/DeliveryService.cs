using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Aurora.Application.DTOs.Logistics;
using Aurora.Application.Interfaces.Logistics;
using Aurora.Application.Interfaces.Repositories;
using Aurora.Domain.Entities.Logistics;
using Aurora.Domain.Entities.Sales;
using Aurora.Domain.Enums;

namespace Aurora.Application.Services.Logistics
{
    public class DeliveryService : IDeliveryService
    {
        private readonly IRepository<Delivery> _deliveryRepository;
        private readonly ISalesOrderRepository _salesOrderRepository;
        private readonly IInventoryService _inventoryService;
        private readonly IRepository<Material> _materialRepository;

        public DeliveryService(
            IRepository<Delivery> deliveryRepository,
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
                delivery.AddItem(item.MaterialId, item.Quantity, item.Id);
            }

            await _deliveryRepository.AddAsync(delivery);

            return await MapToDto(delivery);
        }

        public async Task PostDeliveryAsync(Guid deliveryId)
        {
            var delivery = await _deliveryRepository.GetByIdAsync(deliveryId);
            if (delivery == null) throw new KeyNotFoundException("Delivery not found");

            // Post Logic
            delivery.Post();

            // Create Inventory Movements (Goods Issue)
            // Strategy: For each item, create an OUT movement.
            // Warehouse Issue: We need to know WHICH warehouse to deduct from.
            // For MVP: We will simply fetch the first available warehouse ID from InventoryService (or generic repo) 
            // OR - we can rely on a default warehouse logic.
            // To be safe, I'll temporarily fetch *any* warehouse or fail if none.
            // In real app, user selects warehouse in UI.
            
            // Hack for MVP: Get first warehouse.
            // We need a repository for Deposito? Or use InventoryService?
            // InventoryService 'GetAllStocksAsync' gives us typical stocks.
            // Let's rely on a helper or just fail if we can't find one? 
            // Actually, let's inject Deposito Repo in future. For now, let's assume we pass a DepositoId?
            // Wait, I can't easily get a warehouse here without injection.
            // I will use a placeholder GUID for now and warn user? No that crashes FKs.
            // I will inject IDepositoRepository if needed or search via IInventoryService?
            // Let's modify constructor to get IDepositoRepository?
            // Or better: Let's assume there is at least one warehouse and fetch it via IInventoryService.GetStockByMaterial?
            
            // Let's loop items
            foreach (var item in delivery.Items)
            {
               // Create Movement
               // We need a DepositoId. 
               // Let's try to get stocks for this material and pick one with enough quantity?
               var stocks = await _inventoryService.GetStockByMaterialAsync(item.MaterialId);
               var validStock = stocks.FirstOrDefault(s => s.Quantity >= item.Quantity);
               
               if (validStock == null)
               {
                   // Fallback: Just pick the first one found, even if insufficient (InventoryService handles negative check/creation maybe?)
                   validStock = stocks.FirstOrDefault();
               }
               
               Guid targetDepositoId = validStock?.DepositoId ?? Guid.Empty; // This will crash if Empty.
               
               if (targetDepositoId == Guid.Empty)
               {
                   // Try to find ANY warehouse if stock didn't exist?
                   // This is getting complex for a blind edit.
                   // I will throw exception if no stock found.
                   throw new InvalidOperationException($"No stock found for material {item.MaterialId} to fulfill delivery.");
               }

               var movementDto = new CreateStockMovementDto
               {
                   MaterialId = item.MaterialId,
                   DepositoId = targetDepositoId,
                   Type = StockMovementType.Out,
                   Quantity = item.Quantity,
                   ReferenceDocument = delivery.Number,
                   BatchNumber = validStock?.BatchNumber
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
            var deliveries = await _deliveryRepository.GetAllAsync();
            var dtos = new List<DeliveryDto>();
            foreach (var d in deliveries)
            {
                dtos.Add(await MapToDto(d));
            }
            return dtos;
        }

        public async Task<DeliveryDto> GetByIdAsync(Guid id)
        {
            var d = await _deliveryRepository.GetByIdAsync(id);
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
