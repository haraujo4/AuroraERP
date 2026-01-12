using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Aurora.Application.DTOs.Organization;
using Aurora.Application.Interfaces.Organization;
using Aurora.Application.Interfaces.Repositories;
using Aurora.Domain.Entities.Organization;

namespace Aurora.Application.Services.Organization
{
    public class GrupoEmpresarialService : IGrupoEmpresarialService
    {
        private readonly IGrupoEmpresarialRepository _repository;

        public GrupoEmpresarialService(IGrupoEmpresarialRepository repository)
        {
            _repository = repository;
        }

        public async Task<IEnumerable<GrupoEmpresarialDto>> GetAllAsync()
        {
            var result = await _repository.GetAllAsync();
            return result.Select(g => new GrupoEmpresarialDto
            {
                Id = g.Id,
                Codigo = g.Codigo,
                RazaoSocialConsolidada = g.RazaoSocialConsolidada,
                NomeFantasia = g.NomeFantasia,
                PaisConsolidacao = g.PaisConsolidacao,
                MoedaBase = g.MoedaBase,
                IdiomaPadrao = g.IdiomaPadrao,
                RegimeFiscalConsolidado = g.RegimeFiscalConsolidado,
                IsActive = g.IsActive
            });
        }

        public async Task<GrupoEmpresarialDto?> GetByIdAsync(Guid id)
        {
            var g = await _repository.GetByIdAsync(id);
            if (g == null) return null;

            return new GrupoEmpresarialDto
            {
                Id = g.Id,
                Codigo = g.Codigo,
                RazaoSocialConsolidada = g.RazaoSocialConsolidada,
                NomeFantasia = g.NomeFantasia,
                PaisConsolidacao = g.PaisConsolidacao,
                MoedaBase = g.MoedaBase,
                IdiomaPadrao = g.IdiomaPadrao,
                RegimeFiscalConsolidado = g.RegimeFiscalConsolidado,
                IsActive = g.IsActive
            };
        }

        public async Task<GrupoEmpresarialDto> CreateAsync(CreateGrupoEmpresarialDto dto)
        {
            var entity = new GrupoEmpresarial(
                dto.Codigo,
                dto.RazaoSocialConsolidada,
                dto.NomeFantasia,
                dto.PaisConsolidacao,
                dto.MoedaBase,
                dto.IdiomaPadrao,
                dto.RegimeFiscalConsolidado
            );

            await _repository.AddAsync(entity);

            return new GrupoEmpresarialDto
            {
                Id = entity.Id,
                Codigo = entity.Codigo,
                RazaoSocialConsolidada = entity.RazaoSocialConsolidada,
                NomeFantasia = entity.NomeFantasia,
                PaisConsolidacao = entity.PaisConsolidacao,
                MoedaBase = entity.MoedaBase,
                IdiomaPadrao = entity.IdiomaPadrao,
                RegimeFiscalConsolidado = entity.RegimeFiscalConsolidado,
                IsActive = entity.IsActive
            };
        }

        public async Task UpdateAsync(Guid id, UpdateGrupoEmpresarialDto dto)
        {
            var entity = await _repository.GetByIdAsync(id);
            if (entity == null) throw new KeyNotFoundException($"GrupoEmpresarial {id} not found.");

            // Update logic...
            await _repository.UpdateAsync(entity);
        }

        public async Task DeleteAsync(Guid id)
        {
            await _repository.DeleteAsync(id);
        }
    }
}
