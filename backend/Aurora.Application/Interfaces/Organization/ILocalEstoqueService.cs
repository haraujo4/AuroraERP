using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Aurora.Application.DTOs.Organization;

namespace Aurora.Application.Interfaces.Organization
{
    public interface ILocalEstoqueService
    {
        Task<IEnumerable<LocalEstoqueDto>> GetAllAsync();
        Task<IEnumerable<LocalEstoqueDto>> GetByDepositoAsync(Guid depositoId);
        Task<LocalEstoqueDto?> GetByIdAsync(Guid id);
        Task<LocalEstoqueDto> CreateAsync(CreateLocalEstoqueDto dto);
        Task<LocalEstoqueDto?> UpdateAsync(Guid id, UpdateLocalEstoqueDto dto);
        Task DeleteAsync(Guid id);
    }
}
