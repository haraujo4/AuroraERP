using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Aurora.Application.DTOs.Organization;

namespace Aurora.Application.Interfaces.Organization
{
    public interface ICentroCustoService
    {
        Task<IEnumerable<CentroCustoDto>> GetAllAsync();
        Task<IEnumerable<CentroCustoDto>> GetByEmpresaAsync(Guid empresaId);
        Task<CentroCustoDto?> GetByIdAsync(Guid id);
        Task<CentroCustoDto> CreateAsync(CreateCentroCustoDto dto);
        Task<CentroCustoDto?> UpdateAsync(Guid id, UpdateCentroCustoDto dto);
        Task DeleteAsync(Guid id);
    }
}
