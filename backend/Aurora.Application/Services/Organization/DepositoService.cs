using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Aurora.Application.DTOs.Organization;
using Aurora.Application.Interfaces.Organization;
using Aurora.Application.Interfaces.Repositories;
using Aurora.Domain.Entities.Organization;
using Aurora.Application.Interfaces.Common;

namespace Aurora.Application.Services.Organization
{
    public class DepositoService : IDepositoService
    {
        private readonly IRepository<Deposito> _repository;
        private readonly ICodeGenerationService _codeGenService;

        public DepositoService(IRepository<Deposito> repository, ICodeGenerationService codeGenService)
        {
            _repository = repository;
            _codeGenService = codeGenService;
        }

        public async Task<IEnumerable<DepositoDto>> GetAllAsync()
        {
            var result = await _repository.GetAllAsync();
            return result.Select(MapToDto);
        }

        public async Task<IEnumerable<DepositoDto>> GetByFilialAsync(Guid filialId)
        {
            var result = await _repository.GetAllAsync();
            return result.Where(x => x.FilialId == filialId).Select(MapToDto);
        }

        public async Task<DepositoDto?> GetByIdAsync(Guid id)
        {
            var entity = await _repository.GetByIdAsync(id);
            if (entity == null) return null;
            return MapToDto(entity);
        }

        public async Task<DepositoDto> CreateAsync(CreateDepositoDto dto)
        {
            var code = await _codeGenService.GenerateNextCodeAsync<Deposito>("DEP");
            var entity = new Deposito(code, dto.Descricao, dto.Tipo, dto.ControlaLote, dto.ControlaSerie, dto.FilialId);
            await _repository.AddAsync(entity);
            return MapToDto(entity);
        }

        public async Task<DepositoDto?> UpdateAsync(Guid id, UpdateDepositoDto dto)
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

        private DepositoDto MapToDto(Deposito entity)
        {
            return new DepositoDto
            {
                Id = entity.Id,
                FilialId = entity.FilialId,
                Codigo = entity.Codigo,
                Descricao = entity.Descricao,
                Tipo = entity.Tipo,
                ControlaLote = entity.ControlaLote,
                ControlaSerie = entity.ControlaSerie
            };
        }
    }
}
