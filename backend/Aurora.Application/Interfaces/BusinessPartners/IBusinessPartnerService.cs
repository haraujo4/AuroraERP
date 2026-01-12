using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Aurora.Application.DTOs.BusinessPartners;

namespace Aurora.Application.Interfaces.BusinessPartners
{
    public interface IBusinessPartnerService
    {
        Task<IEnumerable<BusinessPartnerDto>> GetAllAsync();
        Task<BusinessPartnerDto?> GetByIdAsync(Guid id);
        Task<BusinessPartnerDto> CreateAsync(CreateBusinessPartnerDto dto);
        // Task UpdateAsync(Guid id, UpdateBusinessPartnerDto dto);
    }
}
