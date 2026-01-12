using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Aurora.Application.DTOs.CRM;

namespace Aurora.Application.Interfaces.CRM
{
    public interface ILeadService
    {
        Task<IEnumerable<LeadDto>> GetAllAsync();
        Task<LeadDto?> GetByIdAsync(Guid id);
        Task<LeadDto> CreateAsync(CreateLeadDto dto);
        Task UpdateStatusAsync(Guid id, string status);
    }
}
