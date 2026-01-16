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
        private readonly Aurora.Application.Interfaces.Services.IEmailService _emailService;

        public LeadService(ILeadRepository repository, Aurora.Application.Interfaces.Services.IEmailService emailService)
        {
            _repository = repository;
            _emailService = emailService;
        }

        public async Task<IEnumerable<LeadDto>> GetAllAsync()
        {
            var result = await _repository.GetAllAsync();
            return result.Select(MapToDto);
        }

        public async Task<LeadDto?> GetByIdAsync(Guid id)
        {
            var lead = await _repository.GetByIdAsync(id, l => l.Interactions);
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

        public async Task AddInteractionAsync(Guid leadId, string body, string typeStr)
        {
            var lead = await _repository.GetByIdAsync(leadId, l => l.Interactions);
            if (lead == null) throw new Exception("Lead not found");

            if (!Enum.TryParse<InteractionType>(typeStr, true, out var type))
            {
                type = InteractionType.Note;
            }

            var interaction = new LeadInteraction(lead.Id, type, body, DateTime.UtcNow);
            lead.AddInteraction(interaction);
            
            // Use specific repository method to ensure INSERT not UPDATE
            await _repository.AddInteractionAsync(lead, interaction);

            // If Outgoing Email, send via SMTP
            if (type == InteractionType.OutgoingEmail && !string.IsNullOrEmpty(lead.Email))
            {
                var emailMsg = new Aurora.Domain.Models.EmailMessage
                {
                    To = lead.Email,
                    Subject = $"Re: {lead.Title}", // Or keep original subject if tracked
                    Body = body,
                    IsHtml = true 
                };
                await _emailService.SendEmailAsync(emailMsg);
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
                CreatedAt = lead.CreatedAt,
                IsCustomer = lead.IsCustomer,
                Interactions = lead.Interactions.Select(i => new LeadInteractionDto
                {
                    Id = i.Id,
                    Type = i.Type.ToString(),
                    Body = i.Body,
                    SentAt = i.SentAt
                }).OrderByDescending(i => i.SentAt).ToList()
            };
        }
    }
}
