using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Aurora.Application.DTOs.Organization;

namespace Aurora.Application.Interfaces.Organization
{
    public interface IEmpresaService
    {
        Task<IEnumerable<EmpresaDto>> GetAllAsync();
        Task<IEnumerable<EmpresaDto>> GetByGrupoAsync(Guid grupoId);
        Task<EmpresaDto?> GetByIdAsync(Guid id);
        Task<EmpresaDto> CreateAsync(CreateEmpresaDto dto);
        // Add update/delete as needed
    }
}
