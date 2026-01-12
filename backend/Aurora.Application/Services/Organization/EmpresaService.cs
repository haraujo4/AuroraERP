using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Aurora.Application.DTOs.Organization;
using Aurora.Application.Interfaces.Organization;
using Aurora.Application.Interfaces.Repositories;
using Aurora.Domain.Entities.Organization;
using Aurora.Domain.ValueObjects;

namespace Aurora.Application.Services.Organization
{
    public class EmpresaService : IEmpresaService
    {
        private readonly IEmpresaRepository _repository;

        public EmpresaService(IEmpresaRepository repository)
        {
            _repository = repository;
        }

        public async Task<IEnumerable<EmpresaDto>> GetAllAsync()
        {
            var result = await _repository.GetAllAsync();
            return result.Select(e => new EmpresaDto
            {
                Id = e.Id,
                GrupoEmpresarialId = e.GrupoEmpresarialId,
                Codigo = e.Codigo,
                RazaoSocial = e.RazaoSocial,
                NomeFantasia = e.NomeFantasia,
                CNPJ = e.CNPJ,
                IsActive = e.IsActive
            });
        }

        public async Task<IEnumerable<EmpresaDto>> GetByGrupoAsync(Guid grupoId)
        {
            var result = await _repository.FindAsync(e => e.GrupoEmpresarialId == grupoId);
            
            return result.Select(e => new EmpresaDto
            {
                Id = e.Id,
                GrupoEmpresarialId = e.GrupoEmpresarialId,
                Codigo = e.Codigo,
                RazaoSocial = e.RazaoSocial,
                NomeFantasia = e.NomeFantasia,
                CNPJ = e.CNPJ,
                IsActive = e.IsActive
            });
        }

        public async Task<EmpresaDto?> GetByIdAsync(Guid id)
        {
            var e = await _repository.GetByIdAsync(id);
            if (e == null) return null;
            
            return new EmpresaDto
            {
                Id = e.Id,
                GrupoEmpresarialId = e.GrupoEmpresarialId,
                Codigo = e.Codigo,
                RazaoSocial = e.RazaoSocial,
                NomeFantasia = e.NomeFantasia,
                CNPJ = e.CNPJ,
                IsActive = e.IsActive
            };
        }

        public async Task<EmpresaDto> CreateAsync(CreateEmpresaDto dto)
        {
            var address = new Address(
                dto.EnderecoFiscal.Street,
                dto.EnderecoFiscal.Number,
                dto.EnderecoFiscal.Complement,
                dto.EnderecoFiscal.Neighborhood,
                dto.EnderecoFiscal.City,
                dto.EnderecoFiscal.State,
                dto.EnderecoFiscal.Country,
                dto.EnderecoFiscal.ZipCode
            );

            var entity = new Empresa(
                dto.Codigo,
                dto.RazaoSocial,
                dto.NomeFantasia,
                dto.CNPJ,
                address,
                dto.GrupoEmpresarialId
            );

            await _repository.AddAsync(entity);

            return new EmpresaDto
            {
                Id = entity.Id,
                GrupoEmpresarialId = entity.GrupoEmpresarialId,
                Codigo = entity.Codigo,
                RazaoSocial = entity.RazaoSocial,
                IsActive = entity.IsActive
            };
        }
    }
}
