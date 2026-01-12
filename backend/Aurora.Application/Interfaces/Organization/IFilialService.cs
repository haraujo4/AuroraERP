using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Aurora.Application.DTOs.Organization;

namespace Aurora.Application.Interfaces.Organization
{
    public interface IFilialService
    {
        Task<IEnumerable<FilialDto>> GetAllAsync();
        Task<FilialDto> GetByIdAsync(Guid id);
        Task<FilialDto> CreateAsync(CreateFilialDto dto);
        Task UpdateAsync(Guid id, CreateFilialDto dto);
        Task<IEnumerable<DepositoDto>> GetDepositosAsync(Guid filialId);
        Task<DepositoDto> AddDepositoAsync(CreateDepositoDto dto);
    }
}
