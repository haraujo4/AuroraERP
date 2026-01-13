using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Aurora.Application.DTOs.Purchasing;
using Aurora.Application.Interfaces.Logistics; // Added
using Aurora.Application.Interfaces.Purchasing;
using Aurora.Application.Interfaces.Repositories;
using Aurora.Domain.Entities.Purchasing;
using Aurora.Domain.Enums;
using Aurora.Domain.Entities.Fiscal; // Just in case
using System.Linq; // Added for Last() extension method


namespace Aurora.Application.Services.Purchasing
{
    public class PurchasingService : IPurchasingService
    {
        private readonly IPurchasingRepository _repository;
        private readonly IInventoryService _inventoryService;
        private readonly IRepository<Aurora.Domain.Entities.Organization.Deposito> _depositoRepository;
        private readonly IBusinessPartnerRepository _bpRepository;
        private readonly Aurora.Application.Interfaces.Fiscal.ITaxService _taxService;

        public PurchasingService(
            IPurchasingRepository repository,
            IInventoryService inventoryService,
            IRepository<Aurora.Domain.Entities.Organization.Deposito> depositoRepository,
            IBusinessPartnerRepository bpRepository,
            Aurora.Application.Interfaces.Fiscal.ITaxService taxService)
        {
            _repository = repository;
            _inventoryService = inventoryService;
            _depositoRepository = depositoRepository;
            _bpRepository = bpRepository;
            _taxService = taxService;
        }

        public async Task<PurchaseRequisition> CreateRequisitionAsync(CreatePurchaseRequisitionDto dto)
        {
            var count = await _repository.GetRequisitionCountAsync();
            var number = $"PR-{DateTime.Now.Year}-{count + 1:0000}";

            var requisition = new PurchaseRequisition(number, dto.RequiredDate, dto.Requester);

            foreach (var item in dto.Items)
            {
                requisition.AddItem(item.MaterialId, item.Quantity, item.CostCenterId);
            }

            await _repository.AddRequisitionAsync(requisition);
            await _repository.SaveChangesAsync();

            return requisition;
        }

        public async Task<PurchaseRequisition?> GetRequisitionByIdAsync(Guid id)
        {
            return await _repository.GetRequisitionByIdAsync(id);
        }

        public async Task<IEnumerable<PurchaseRequisition>> GetAllRequisitionsAsync()
        {
            return await _repository.GetAllRequisitionsAsync();
        }

        public async Task ApproveRequisitionAsync(Guid id)
        {
            var requisition = await _repository.GetRequisitionByIdAsync(id);
            if (requisition == null) throw new Exception("Requisition not found");

            requisition.Approve();
            await _repository.SaveChangesAsync();
        }

        public async Task<PurchaseOrder> CreateOrderAsync(CreatePurchaseOrderDto dto)
        {
            var count = await _repository.GetOrderCountAsync();
            var number = $"PO-{DateTime.Now.Year}-{count + 1:0000}";

            var order = new PurchaseOrder(number, dto.SupplierId, dto.DeliveryDate);

            // Get Supplier Info for Tax Calculation
            var supplier = await _bpRepository.GetByIdAsync(dto.SupplierId);
            var destState = supplier?.Addresses.FirstOrDefault(a => a.IsPrincipal)?.Address.State ?? "SP";
            var sourceState = "SP"; // Assuming Company is in SP for now

            foreach (var item in dto.Items)
            {
                order.AddItem(item.MaterialId, item.Quantity, item.UnitPrice);
                
                // Calculate Taxes for the last added item
                var orderItem = order.Items.Last();
                
                var taxResult = await _taxService.CalculateTaxAsync(new Aurora.Application.DTOs.Fiscal.TaxCalculationInputDto
                {
                    SourceState = sourceState,
                    DestState = destState,
                    OperationType = OperationType.Purchase,
                    ItemValue = orderItem.TotalAmount,
                    // NcmCode could be fetched from Material here if available
                });

                orderItem.SetFiscalInfo(
                    taxResult.Cfop,
                    taxResult.IcmsRate,
                    taxResult.IpiRate,
                    taxResult.PisRate,
                    taxResult.CofinsRate
                );
            }

            await _repository.AddOrderAsync(order);
            await _repository.SaveChangesAsync();
            return order;
        }

        public async Task<PurchaseOrder?> GetOrderByIdAsync(Guid id)
        {
             return await _repository.GetOrderByIdAsync(id);
        }

        public async Task<IEnumerable<PurchaseOrder>> GetAllOrdersAsync()
        {
             return await _repository.GetAllOrdersAsync();
        }

        public async Task ApproveOrderAsync(Guid id)
        {
             var order = await _repository.GetOrderByIdAsync(id);
            if (order == null) throw new Exception("Order not found");

            order.Approve();
            await _repository.SaveChangesAsync();
        }

        public async Task ReceiveOrderAsync(Guid id)
        {
             var order = await _repository.GetOrderByIdAsync(id);
            if (order == null) throw new Exception("Order not found");

            if (order.Status == PurchasingStatus.Completed)
                throw new Exception("Order already received.");

            // Simulation: Pick the first Deposito available
            var depositos = await _depositoRepository.GetAllAsync();
            var defaultDeposito = System.Linq.Enumerable.FirstOrDefault(depositos);
            
            if (defaultDeposito == null)
            {
                throw new Exception("No Deposito (Warehouse) found to receive goods. Please create one in Organization module.");
            }

            foreach (var item in order.Items)
            {
                await _inventoryService.AddStockMovementAsync(new Aurora.Application.Interfaces.Logistics.CreateStockMovementDto
                {
                    MaterialId = item.MaterialId,
                    DepositoId = defaultDeposito.Id,
                    Quantity = item.Quantity,
                    UnitPrice = item.UnitPrice,
                    Type = StockMovementType.In, // Purchase Receipt (In)
                    ReferenceDocument = order.OrderNumber,
                    BatchNumber = DateTime.Now.ToString("yyyyMMdd") // Auto-generate simple batch
                });

                item.Receive(item.Quantity); // Mark item as fully received (simplified)
            }

            order.SetStatus(PurchasingStatus.Completed);
            await _repository.SaveChangesAsync();
        }
    }
}
