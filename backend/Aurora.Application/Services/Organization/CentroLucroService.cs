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
    public class CentroLucroService : ICentroLucroService
    {
        private readonly IRepository<CentroLucro> _repository;

        public CentroLucroService(IRepository<CentroLucro> repository)
        {
            _repository = repository;
        }

        public async Task<IEnumerable<CentroLucroDto>> GetAllAsync()
        {
            var result = await _repository.GetAllAsync();
            return result.Select(MapToDto);
        }

        public async Task<IEnumerable<CentroLucroDto>> GetByEmpresaAsync(Guid empresaId)
        {
            var result = await _repository.GetAllAsync();
            return result.Where(x => x.EmpresaId == empresaId).Select(MapToDto);
        }

        public async Task<CentroLucroDto?> GetByIdAsync(Guid id)
        {
            var entity = await _repository.GetByIdAsync(id);
            if (entity == null) return null;
            return MapToDto(entity);
        }

        public async Task<CentroLucroDto> CreateAsync(CreateCentroLucroDto dto)
        {
            var entity = new CentroLucro(dto.Codigo, dto.Descricao, dto.Responsavel, dto.EmpresaId);
            await _repository.AddAsync(entity);
            return MapToDto(entity);
        }

        public async Task<CentroLucroDto?> UpdateAsync(Guid id, UpdateCentroLucroDto dto)
        {
            var entity = await _repository.GetByIdAsync(id);
            if (entity == null) return null;

            await _repository.UpdateAsync(entity);
            return MapToDto(entity);
        }

        public async Task DeleteAsync(Guid id)
        {
            await _repository.DeleteAsync(id);
        }

        private CentroLucroDto MapToDto(CentroLucro entity)
        {
            return new CentroLucroDto
            {
                Id = entity.Id,
                EmpresaId = entity.EmpresaId,
                UnidadeNegocioId = entity.UnidadeNegocioId,
                Codigo = entity.Codigo,
                Descricao = entity.Descricao,
                Responsavel = entity.Responsavel
            };
        }
    }
}
