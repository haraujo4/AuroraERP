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
    public class LeadService : ILeadService
    {
        private readonly ILeadRepository _repository;

        public LeadService(ILeadRepository repository)
        {
            _repository = repository;
        }

        public async Task<IEnumerable<LeadDto>> GetAllAsync()
        {
            var result = await _repository.GetAllAsync();
            return result.Select(MapToDto);
        }

        public async Task<LeadDto?> GetByIdAsync(Guid id)
        {
            var lead = await _repository.GetByIdAsync(id);
            return lead == null ? null : MapToDto(lead);
        }

        public async Task<LeadDto> CreateAsync(CreateLeadDto dto)
        {
            var entity = new Lead(
                dto.Title,
                dto.Source,
                dto.ContactName,
                dto.Email,
                dto.CompanyName
            );
            
            if (dto.EstimatedValue.HasValue)
                entity.SetEstimatedValue(dto.EstimatedValue.Value);
                
            if (!string.IsNullOrEmpty(dto.Notes))
                entity.AddNotes(dto.Notes);
                
             // Default phone optional mapping
             
            await _repository.AddAsync(entity);
            return MapToDto(entity);
        }

        public async Task UpdateStatusAsync(Guid id, string status)
        {
            var entity = await _repository.GetByIdAsync(id);
            if (entity == null) throw new Exception("Lead not found");

            if (Enum.TryParse<LeadStatus>(status, true, out var newStatus))
            {
                entity.UpdateStatus(newStatus);
                await _repository.UpdateAsync(entity);
            }
            else 
            {
                throw new ArgumentException("Invalid status");
            }
        }

        private static LeadDto MapToDto(Lead lead)
        {
            return new LeadDto
            {
                Id = lead.Id,
                Title = lead.Title,
                Source = lead.Source,
                ContactName = lead.ContactName,
                Email = lead.Email,
                Phone = lead.Phone,
                CompanyName = lead.CompanyName,
                Status = lead.Status.ToString(),
                EstimatedValue = lead.EstimatedValue,
                Notes = lead.Notes,
                CreatedAt = lead.CreatedAt
            };
        }
    }
}
