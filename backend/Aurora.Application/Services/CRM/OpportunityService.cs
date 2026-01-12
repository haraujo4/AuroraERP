using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Aurora.Application.DTOs.CRM;
using Aurora.Application.Interfaces.CRM;
using Aurora.Application.Interfaces.Repositories;
using Aurora.Domain.Entities.CRM;

namespace Aurora.Application.Services.CRM
{
    public class OpportunityService : IOpportunityService
    {
        private readonly IOpportunityRepository _repository;

        public OpportunityService(IOpportunityRepository repository)
        {
            _repository = repository;
        }

        public async Task<IEnumerable<OpportunityDto>> GetAllAsync()
        {
            var result = await _repository.GetAllAsync();
            return result.Select(MapToDto);
        }

        public async Task<OpportunityDto?> GetByIdAsync(Guid id)
        {
            var entity = await _repository.GetByIdAsync(id);
            return entity == null ? null : MapToDto(entity);
        }

        public async Task<OpportunityDto> CreateAsync(CreateOpportunityDto dto)
        {
            // Note: In real world, validate BP or Lead existence via repositories
            var entity = new Opportunity(
                dto.Title,
                dto.BusinessPartnerId,
                dto.LeadId,
                dto.EstimatedValue,
                dto.CloseDate
            );

            await _repository.AddAsync(entity);
            return MapToDto(entity);
        }

        public async Task UpdateStageAsync(Guid id, string stage, int probability)
        {
            var entity = await _repository.GetByIdAsync(id);
            if (entity == null) throw new Exception("Opportunity not found");

            if (Enum.TryParse<OpportunityStage>(stage, true, out var newStage))
            {
                entity.ChangeStage(newStage, probability);
                await _repository.UpdateAsync(entity);
            }
            else
            {
                throw new ArgumentException("Invalid stage");
            }
        }

        private static OpportunityDto MapToDto(Opportunity op)
        {
            return new OpportunityDto
            {
                Id = op.Id,
                Title = op.Title,
                BusinessPartnerId = op.BusinessPartnerId,
                BusinessPartnerName = op.BusinessPartner?.RazaoSocial, // Assuming Include
                LeadId = op.LeadId,
                LeadName = op.Lead?.Title, // Or contact name
                EstimatedValue = op.EstimatedValue,
                CloseDate = op.CloseDate,
                Probability = op.Probability,
                Stage = op.Stage.ToString(),
                CreatedAt = op.CreatedAt
            };
        }
    }
}
