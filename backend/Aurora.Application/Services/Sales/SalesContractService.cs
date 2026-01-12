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
    public class SalesContractService : ISalesContractService
    {
        private readonly ISalesContractRepository _repository;

        public SalesContractService(ISalesContractRepository repository)
        {
            _repository = repository;
        }

        public async Task<IEnumerable<SalesContractDto>> GetAllAsync()
        {
            var contracts = await _repository.GetAllWithDetailsAsync();
            return contracts.Select(MapToDto);
        }

        public async Task<SalesContractDto> GetByIdAsync(Guid id)
        {
            var contract = await _repository.GetByIdWithDetailsAsync(id);
            if (contract == null) throw new Exception("Contract not found");
            return MapToDto(contract);
        }

        public async Task<SalesContractDto> CreateAsync(CreateSalesContractDto dto)
        {
            var number = $"CTR-{DateTime.Now.Year}-{new Random().Next(1000, 9999)}"; // Simplified

            var contract = new SalesContract
            {
                BusinessPartnerId = dto.BusinessPartnerId,
                ContractNumber = number,
                StartDate = dto.StartDate,
                EndDate = dto.EndDate,
                BillingDay = dto.BillingDay,
                BillingFrequency = dto.BillingFrequency,
                Status = "Draft",
                // CreatedBy set by BaseEntity/Auditable typically, or ignore if protected. 
                // CreatedAt initialized in ctor
            };

            foreach (var itemDto in dto.Items)
            {
                var item = new SalesContractItem
                {
                    MaterialId = itemDto.MaterialId,
                    Quantity = itemDto.Quantity,
                    UnitPrice = itemDto.UnitPrice,
                    DiscountPercentage = itemDto.DiscountPercentage,
                    TotalValue = (itemDto.Quantity * itemDto.UnitPrice) * (1 - itemDto.DiscountPercentage / 100),
                };
                contract.Items.Add(item);
            }

            CalculateTotal(contract);

            await _repository.AddAsync(contract);
            
            // Reload with details
            return await GetByIdAsync(contract.Id);
        }

        public async Task<SalesContractDto> UpdateAsync(Guid id, UpdateSalesContractDto dto)
        {
            var contract = await _repository.GetByIdWithDetailsAsync(id);
            if (contract == null) throw new Exception("Contract not found");

            contract.BusinessPartnerId = dto.BusinessPartnerId;
            contract.StartDate = dto.StartDate;
            contract.EndDate = dto.EndDate;
            contract.BillingDay = dto.BillingDay;
            contract.BillingFrequency = dto.BillingFrequency;
            // Update items logic would be more complex with Repository (need to clear and add, but repo.Update usually just marks state).
            // For simplicity in this step, I'm just clearing the list in object and recreating items.
            // EF Core might need explicit delete commands for children if not configured with cascade delete deeply.
            // But let's try modifying the collection.
            
            contract.Items.Clear();

            foreach (var itemDto in dto.Items)
            {
                 var item = new SalesContractItem
                {
                    SalesContractId = id,
                    MaterialId = itemDto.MaterialId,
                    Quantity = itemDto.Quantity,
                    UnitPrice = itemDto.UnitPrice,
                    DiscountPercentage = itemDto.DiscountPercentage,
                    TotalValue = (itemDto.Quantity * itemDto.UnitPrice) * (1 - itemDto.DiscountPercentage / 100),
                };
                contract.Items.Add(item);
            }

            CalculateTotal(contract);

            await _repository.UpdateAsync(contract);
            return await GetByIdAsync(id);
        }

        public async Task DeleteAsync(Guid id)
        {
             var contract = await _repository.GetByIdAsync(id);
             if (contract == null) throw new Exception("Contract not found");
             
             await _repository.DeleteAsync(id);
        }

        public async Task<SalesContractDto> UpdateStatusAsync(Guid id, string status)
        {
            var contract = await _repository.GetByIdAsync(id);
            if (contract == null) throw new Exception("Contract not found");

            contract.Status = status;
            await _repository.UpdateAsync(contract);
            return await GetByIdAsync(id);
        }

        private void CalculateTotal(SalesContract contract)
        {
            contract.TotalMonthlyValue = contract.Items.Sum(i => i.TotalValue);
        }

        private SalesContractDto MapToDto(SalesContract entity)
        {
            return new SalesContractDto
            {
                Id = entity.Id,
                ContractNumber = entity.ContractNumber,
                BusinessPartnerId = entity.BusinessPartnerId,
                BusinessPartnerName = entity.BusinessPartner?.RazaoSocial ?? "N/A",
                StartDate = entity.StartDate,
                EndDate = entity.EndDate,
                BillingDay = entity.BillingDay,
                BillingFrequency = entity.BillingFrequency,
                Status = entity.Status,
                TotalMonthlyValue = entity.TotalMonthlyValue,
                Items = entity.Items.Select(i => new SalesContractItemDto
                {
                    Id = i.Id,
                    MaterialId = i.MaterialId,
                    MaterialName = i.Material?.Description ?? "N/A",
                    Quantity = i.Quantity,
                    UnitPrice = i.UnitPrice,
                    DiscountPercentage = i.DiscountPercentage,
                    TotalValue = i.TotalValue
                }).ToList()
            };
        }
    }
}
