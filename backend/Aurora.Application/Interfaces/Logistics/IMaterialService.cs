using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Aurora.Application.DTOs.Logistics;

namespace Aurora.Application.Interfaces.Logistics
{
    public interface IMaterialService
    {
        Task<IEnumerable<MaterialDto>> GetAllAsync();
        Task<MaterialDto> GetByIdAsync(Guid id);
        Task<MaterialDto> CreateAsync(CreateMaterialDto dto);
        Task<MaterialDto> UpdateAsync(Guid id, UpdateMaterialDto dto);
        Task DeleteAsync(Guid id);
    }
}
