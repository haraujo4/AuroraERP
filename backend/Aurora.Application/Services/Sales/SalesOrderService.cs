using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Aurora.Application.DTOs.Sales;
using Aurora.Application.Interfaces.Repositories;
using Aurora.Application.Interfaces.Sales;
using Aurora.Domain.Entities.Sales;

namespace Aurora.Application.Services.Sales
{
    public class SalesOrderService : ISalesOrderService
    {
        private readonly ISalesOrderRepository _repository;
        private readonly ISalesQuoteRepository _quoteRepository;

        public SalesOrderService(ISalesOrderRepository repository, ISalesQuoteRepository quoteRepository)
        {
            _repository = repository;
            _quoteRepository = quoteRepository;
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

            foreach (var itemDto in dto.Items)
            {
                order.AddItem(itemDto.MaterialId, itemDto.Quantity, itemDto.UnitPrice, itemDto.DiscountPercentage);
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
            }
            else
            {
                throw new Exception("Invalid Status");
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
