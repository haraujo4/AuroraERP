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
    public class SalesQuoteService : ISalesQuoteService
    {
        private readonly ISalesQuoteRepository _repository;
        private readonly IBusinessPartnerRepository _bpRepository;
        private readonly IOpportunityRepository _oppRepository;
        private readonly IRepository<Aurora.Domain.Entities.Logistics.Material> _materialRepository; // Direct usage for simplicity

        public SalesQuoteService(ISalesQuoteRepository repository, IBusinessPartnerRepository bpRepository, IOpportunityRepository oppRepository, IRepository<Aurora.Domain.Entities.Logistics.Material> materialRepository)
        {
            _repository = repository;
            _bpRepository = bpRepository;
            _oppRepository = oppRepository;
            _materialRepository = materialRepository;
        }

        public async Task<IEnumerable<SalesQuoteDto>> GetAllAsync()
        {
            var quotes = await _repository.GetAllWithDetailsAsync();
            return quotes.Select(MapToDto);
        }

        public async Task<SalesQuoteDto> GetByIdAsync(Guid id)
        {
            var quote = await _repository.GetByIdWithDetailsAsync(id);
            if (quote == null) return null;
            return MapToDto(quote);
        }

        public async Task<SalesQuoteDto> CreateAsync(CreateSalesQuoteDto dto)
        {
            var number = $"QT-{DateTime.Now.Year}-{new Random().Next(1000, 9999)}";
            
            var quote = new SalesQuote(number, dto.BusinessPartnerId, dto.ValidUntil, dto.OpportunityId);

            foreach (var itemDto in dto.Items)
            {
                quote.AddItem(itemDto.MaterialId, itemDto.Quantity, itemDto.UnitPrice, itemDto.DiscountPercentage);
            }

            await _repository.AddAsync(quote);
            
            // Reload with details for DTO mapping
            var createdQuote = await _repository.GetByIdWithDetailsAsync(quote.Id);
            return MapToDto(createdQuote);
        }

        public async Task UpdateStatusAsync(Guid id, string status)
        {
            var quote = await _repository.GetByIdAsync(id);
            if (quote == null) throw new Exception("Quote not found");

            if (Enum.TryParse<SalesQuoteStatus>(status, out var newStatus))
            {
                quote.UpdateStatus(newStatus);
                await _repository.UpdateAsync(quote);
            }
            else
            {
                throw new Exception("Invalid Status");
            }
        }

        private SalesQuoteDto MapToDto(SalesQuote entity)
        {
            return new SalesQuoteDto
            {
                Id = entity.Id,
                Number = entity.Number,
                BusinessPartnerId = entity.BusinessPartnerId,
                BusinessPartnerName = entity.BusinessPartner != null ? entity.BusinessPartner.RazaoSocial : "Unknown",
                OpportunityId = entity.OpportunityId,
                OpportunityTitle = entity.Opportunity != null ? entity.Opportunity.Title : null,
                ValidUntil = entity.ValidUntil,
                Status = entity.Status.ToString(),
                TotalValue = entity.TotalValue,
                Items = entity.Items.Select(i => new SalesQuoteItemDto
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
