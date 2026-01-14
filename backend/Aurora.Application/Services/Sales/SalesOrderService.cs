using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Aurora.Application.DTOs.Sales;
using Aurora.Application.Interfaces.Repositories;
using Aurora.Application.Interfaces.Sales;
using Aurora.Domain.Entities.Sales;
using Aurora.Application.Interfaces.Services;
using Microsoft.Extensions.Logging;

namespace Aurora.Application.Services.Sales
{
    public class SalesOrderService : ISalesOrderService
    {
        private readonly ISalesOrderRepository _repository;
        private readonly ISalesQuoteRepository _quoteRepository;
        private readonly IBusinessPartnerRepository _bpRepository;
        private readonly Aurora.Application.Interfaces.Fiscal.ITaxService _taxService;
        private readonly IPricingService _pricingService;
        private readonly IEmailQueue _emailQueue;
        private readonly Microsoft.Extensions.Logging.ILogger<SalesOrderService> _logger;

        public SalesOrderService(
            ISalesOrderRepository repository, 
            ISalesQuoteRepository quoteRepository,
            IBusinessPartnerRepository bpRepository,
            Aurora.Application.Interfaces.Fiscal.ITaxService taxService,
            IPricingService pricingService,
            IEmailQueue emailQueue,
            Microsoft.Extensions.Logging.ILogger<SalesOrderService> logger)
        {
            _repository = repository;
            _quoteRepository = quoteRepository;
            _bpRepository = bpRepository;
            _taxService = taxService;
            _pricingService = pricingService;
            _emailQueue = emailQueue;
            _logger = logger;
        }

        public async Task<IEnumerable<SalesOrderDto>> GetAllAsync()
        {
            var orders = await _repository.GetAllWithDetailsAsync();
            return orders.Select(MapToDto);
        }

        public async Task<SalesOrderDto> GetByIdAsync(Guid id)
        {
            var order = await _repository.GetByIdWithDetailsAsync(id);
            if (order == null) return null;
            return MapToDto(order);
        }

        public async Task<SalesOrderDto> CreateAsync(CreateSalesOrderDto dto)
        {
            var number = $"SO-{DateTime.Now.Year}-{new Random().Next(1000, 9999)}";
            var order = new SalesOrder(number, dto.BusinessPartnerId, dto.OrderDate, dto.QuoteId);

            // Get BP Info for Tax Calculation
            var bp = await _bpRepository.GetByIdAsync(dto.BusinessPartnerId);
            var destState = bp?.Addresses.FirstOrDefault(a => a.IsPrincipal)?.Address.State ?? "SP";
            var sourceState = "SP"; // Assuming Company/Branch in SP

            foreach (var itemDto in dto.Items)
            {
                var unitPrice = itemDto.UnitPrice;
                var discount = itemDto.DiscountPercentage;

                if (unitPrice == 0)
                {
                    var pricing = await _pricingService.CalculatePricingAsync(itemDto.MaterialId, dto.BusinessPartnerId, itemDto.Quantity);
                    unitPrice = pricing.BasePrice; // Using BasePrice from material/pricelist
                    discount = pricing.DiscountPercentage;
                }
                
                order.AddItem(itemDto.MaterialId, itemDto.Quantity, unitPrice, discount);
                
                // Calculate Taxes
                var orderItem = order.Items.Last();
                var taxResult = await _taxService.CalculateTaxAsync(new Aurora.Application.DTOs.Fiscal.TaxCalculationInputDto
                {
                    SourceState = sourceState,
                    DestState = destState,
                    OperationType = Aurora.Domain.Enums.OperationType.Sales,
                    ItemValue = orderItem.TotalValue
                });

                orderItem.SetFiscalInfo(
                    taxResult.Cfop,
                    taxResult.IcmsRate,
                    taxResult.IpiRate,
                    taxResult.PisRate,
                    taxResult.CofinsRate
                );
            }

            await _repository.AddAsync(order);
            
            // Reload with details
            var created = await _repository.GetByIdWithDetailsAsync(order.Id);
            return MapToDto(created);
        }

        public async Task<SalesOrderDto> CreateFromQuoteAsync(Guid quoteId)
        {
            var quote = await _quoteRepository.GetByIdWithDetailsAsync(quoteId);
            if (quote == null) throw new Exception("Quote not found");

            // Create Order from Quote
            var createDto = new CreateSalesOrderDto
            {
                BusinessPartnerId = quote.BusinessPartnerId,
                QuoteId = quote.Id,
                OrderDate = DateTime.Now,
                Items = quote.Items.Select(i => new CreateSalesOrderItemDto
                {
                    MaterialId = i.MaterialId,
                    Quantity = i.Quantity,
                    UnitPrice = i.UnitPrice,
                    DiscountPercentage = i.DiscountPercentage
                }).ToList()
            };

            var orderDto = await CreateAsync(createDto);

            // Update Quote Status
            quote.UpdateStatus(SalesQuoteStatus.Converted);
            await _quoteRepository.UpdateAsync(quote);

            // Send Email Notification
            await SendOrderEmailAsync(createDto.BusinessPartnerId, orderDto, "Novo Pedido de Venda Criado");

            return orderDto;
        }

        public async Task UpdateStatusAsync(Guid id, string status)
        {
            var order = await _repository.GetByIdAsync(id);
            if (order == null) throw new Exception("Order not found");

            if (Enum.TryParse<SalesOrderStatus>(status, out var newStatus))
            {
                order.UpdateStatus(newStatus);
                await _repository.UpdateAsync(order);
                
                // If Confirmed, send email
                if (newStatus == SalesOrderStatus.Confirmed)
                {
                    // Need to map to DTO to reuse email logic or just pass ID
                    var dto = MapToDto(order);
                    await SendOrderEmailAsync(order.BusinessPartnerId, dto, "Pedido de Venda Confirmado");
                }
            }
            else
            {
                throw new Exception("Invalid Status");
            }
        }

        private async Task SendOrderEmailAsync(Guid bpId, SalesOrderDto order, string subject)
        {
            try
            {
                _logger.LogInformation($"[Email] Enqueueing email for Order {order.Number} to BP {bpId}");
                var bp = await _bpRepository.GetByIdAsync(bpId, b => b.Contacts);
                
                if (bp == null)
                {
                     _logger.LogWarning($"[Email] BP {bpId} not found.");
                     return;
                }

                var email = bp.Contacts.FirstOrDefault()?.Email;
                _logger.LogInformation($"[Email] Found email: {email ?? "NULL"}");

                if (!string.IsNullOrEmpty(email))
                {
                    var body = $@"
                        <h1>{subject}</h1>
                        <p>Olá <strong>{bp.RazaoSocial}</strong>,</p>
                        <p>O pedido de venda <strong>{order.Number}</strong> foi processado.</p>
                        <p><strong>Valor Total:</strong> {order.TotalValue:C}</p>
                        <p>Status: {order.Status}</p>
                        <br/>
                        <p>Atenciosamente,<br/>Equipe Aurora ERP</p>
                    ";

                    await _emailQueue.EnqueueAsync(new Aurora.Domain.Models.EmailMessage
                    {
                        To = email,
                        Subject = $"{subject} - {order.Number}",
                        Body = body,
                        IsHtml = true
                    });
                    _logger.LogInformation($"[Email] Email enqueued successfully.");
                }
                else
                {
                    _logger.LogWarning($"[Email] No valid email found for BP {bp.RazaoSocial}. Contacts count: {bp.Contacts.Count}");
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, $"[Email] Failed to enqueue email: {ex.Message}");
            }
        }

        private SalesOrderDto MapToDto(SalesOrder entity)
        {
            return new SalesOrderDto
            {
                Id = entity.Id,
                Number = entity.Number,
                BusinessPartnerId = entity.BusinessPartnerId,
                BusinessPartnerName = entity.BusinessPartner != null ? entity.BusinessPartner.RazaoSocial : "Unknown",
                QuoteId = entity.QuoteId,
                QuoteNumber = entity.Quote != null ? entity.Quote.Number : null,
                OrderDate = entity.OrderDate,
                Status = entity.Status.ToString(),
                TotalValue = entity.TotalValue,
                Items = entity.Items.Select(i => new SalesOrderItemDto
                {
                    Id = i.Id,
                    MaterialId = i.MaterialId,
                    MaterialName = i.Material != null ? i.Material.Description : "Unknown",
                    Quantity = i.Quantity,
                    UnitPrice = i.UnitPrice,
                    DiscountPercentage = i.DiscountPercentage,
                    TotalValue = i.TotalValue
                }).ToList()
            };
        }
    }
}
