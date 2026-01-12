using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Aurora.Application.DTOs.Organization;

namespace Aurora.Application.Interfaces.Organization
{
    public interface IGrupoEmpresarialService
    {
        Task<IEnumerable<GrupoEmpresarialDto>> GetAllAsync();
        Task<GrupoEmpresarialDto?> GetByIdAsync(Guid id);
        Task<GrupoEmpresarialDto> CreateAsync(CreateGrupoEmpresarialDto dto);
        Task UpdateAsync(Guid id, UpdateGrupoEmpresarialDto dto);
        Task DeleteAsync(Guid id);
    }
}
