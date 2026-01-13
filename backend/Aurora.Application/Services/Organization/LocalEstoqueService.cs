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
    public class LocalEstoqueService : ILocalEstoqueService
    {
        private readonly IRepository<LocalEstoque> _repository;

        public LocalEstoqueService(IRepository<LocalEstoque> repository)
        {
            _repository = repository;
        }

        public async Task<IEnumerable<LocalEstoqueDto>> GetAllAsync()
        {
            var result = await _repository.GetAllAsync();
            return result.Select(MapToDto);
        }

        public async Task<IEnumerable<LocalEstoqueDto>> GetByDepositoAsync(Guid depositoId)
        {
            var result = await _repository.GetAllAsync();
            return result.Where(x => x.DepositoId == depositoId).Select(MapToDto);
        }

        public async Task<LocalEstoqueDto?> GetByIdAsync(Guid id)
        {
            var entity = await _repository.GetByIdAsync(id);
            if (entity == null) return null;
            return MapToDto(entity);
        }

        public async Task<LocalEstoqueDto> CreateAsync(CreateLocalEstoqueDto dto)
        {
            var entity = new LocalEstoque(dto.Codigo, dto.Tipo, dto.PermitePicking, dto.PermiteInventario, dto.DepositoId);
            await _repository.AddAsync(entity);
            return MapToDto(entity);
        }

        public async Task<LocalEstoqueDto?> UpdateAsync(Guid id, UpdateLocalEstoqueDto dto)
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

        private LocalEstoqueDto MapToDto(LocalEstoque entity)
        {
            return new LocalEstoqueDto
            {
                Id = entity.Id,
                DepositoId = entity.DepositoId,
                Codigo = entity.Codigo,
                Tipo = entity.Tipo,
                PermitePicking = entity.PermitePicking,
                PermiteInventario = entity.PermiteInventario
            };
        }
    }
}
