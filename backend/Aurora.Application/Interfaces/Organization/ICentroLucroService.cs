using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Aurora.Application.DTOs.Organization;

namespace Aurora.Application.Interfaces.Organization
{
    public interface ICentroLucroService
    {
        Task<IEnumerable<CentroLucroDto>> GetAllAsync();
        Task<IEnumerable<CentroLucroDto>> GetByEmpresaAsync(Guid empresaId);
        Task<CentroLucroDto?> GetByIdAsync(Guid id);
        Task<CentroLucroDto> CreateAsync(CreateCentroLucroDto dto);
        Task<CentroLucroDto?> UpdateAsync(Guid id, UpdateCentroLucroDto dto);
        Task DeleteAsync(Guid id);
    }
}
