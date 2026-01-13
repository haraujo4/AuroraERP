using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Aurora.Application.DTOs.Organization;
using Aurora.Application.Interfaces.Organization;
using Aurora.Application.Interfaces.Repositories;
using Aurora.Domain.Entities.Organization;
using Aurora.Domain.Entities.Security;
using Aurora.Domain.ValueObjects;
using Aurora.Application.Interfaces.Security;

namespace Aurora.Application.Services.Organization
{
    public class EmpresaService : IEmpresaService
    {
        private readonly IEmpresaRepository _repository;
        private readonly ICurrentUserService _currentUserService;
        private readonly IRepository<User> _userRepository;

        public EmpresaService(
            IEmpresaRepository repository,
            ICurrentUserService currentUserService,
            IRepository<User> userRepository)
        {
            _repository = repository;
            _currentUserService = currentUserService;
            _userRepository = userRepository;
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

            // Auto-link context for the creating user if they don't have one
            var currentUserId = _currentUserService.UserId;
            if (!string.IsNullOrEmpty(currentUserId) && Guid.TryParse(currentUserId, out var userId))
            {
                var user = await _userRepository.GetByIdAsync(userId);
                if (user != null && user.EmpresaId == null)
                {
                    user.SetContext(entity.Id, null);
                    await _userRepository.UpdateAsync(user);
                }
            }

            return new EmpresaDto
            {
                Id = entity.Id,
                GrupoEmpresarialId = entity.GrupoEmpresarialId,
                Codigo = entity.Codigo,
                RazaoSocial = entity.RazaoSocial,
                NomeFantasia = entity.NomeFantasia,
                CNPJ = entity.CNPJ,
                EnderecoFiscal = new AddressDto {
                     Street = entity.EnderecoFiscal.Street,
                     Number = entity.EnderecoFiscal.Number,
                     Complement = entity.EnderecoFiscal.Complement,
                     Neighborhood = entity.EnderecoFiscal.Neighborhood,
                     City = entity.EnderecoFiscal.City,
                     State = entity.EnderecoFiscal.State,
                     Country = entity.EnderecoFiscal.Country,
                     ZipCode = entity.EnderecoFiscal.ZipCode
                },
                IsActive = entity.IsActive
            };
        }

        public async Task<EmpresaDto?> UpdateAsync(Guid id, UpdateEmpresaDto dto)
        {
            var entity = await _repository.GetByIdAsync(id);
            if (entity == null) return null;

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

            entity.UpdateDetails(dto.RazaoSocial, dto.NomeFantasia, dto.CNPJ, address);
            await _repository.UpdateAsync(entity);

            return new EmpresaDto
            {
                Id = entity.Id,
                GrupoEmpresarialId = entity.GrupoEmpresarialId,
                Codigo = entity.Codigo,
                RazaoSocial = entity.RazaoSocial,
                NomeFantasia = entity.NomeFantasia,
                CNPJ = entity.CNPJ,
                EnderecoFiscal = new AddressDto {
                     Street = entity.EnderecoFiscal.Street,
                     Number = entity.EnderecoFiscal.Number,
                     Complement = entity.EnderecoFiscal.Complement,
                     Neighborhood = entity.EnderecoFiscal.Neighborhood,
                     City = entity.EnderecoFiscal.City,
                     State = entity.EnderecoFiscal.State,
                     Country = entity.EnderecoFiscal.Country,
                     ZipCode = entity.EnderecoFiscal.ZipCode
                },
                IsActive = entity.IsActive
            };
        }
    }
}
