using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Aurora.Application.DTOs.CRM;

namespace Aurora.Application.Interfaces.CRM
{
    public interface IOpportunityService
    {
        Task<IEnumerable<OpportunityDto>> GetAllAsync();
        Task<OpportunityDto?> GetByIdAsync(Guid id);
        Task<OpportunityDto> CreateAsync(CreateOpportunityDto dto);
        Task UpdateStageAsync(Guid id, string stage, int probability);
    }
}
