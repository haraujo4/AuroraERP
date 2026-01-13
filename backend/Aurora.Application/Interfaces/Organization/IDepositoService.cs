using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Aurora.Application.DTOs.Organization;

namespace Aurora.Application.Interfaces.Organization
{
    public interface IDepositoService
    {
        Task<IEnumerable<DepositoDto>> GetAllAsync();
        Task<IEnumerable<DepositoDto>> GetByFilialAsync(Guid filialId);
        Task<DepositoDto?> GetByIdAsync(Guid id);
        Task<DepositoDto> CreateAsync(CreateDepositoDto dto);
        Task<DepositoDto?> UpdateAsync(Guid id, UpdateDepositoDto dto);
        Task DeleteAsync(Guid id);
    }
}
