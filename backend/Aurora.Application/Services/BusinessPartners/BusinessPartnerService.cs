using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Aurora.Application.DTOs.BusinessPartners;
using Aurora.Application.Interfaces.BusinessPartners;
using Aurora.Application.Interfaces.Repositories;
using Aurora.Domain.Entities.BusinessPartners;
using Aurora.Domain.ValueObjects;

namespace Aurora.Application.Services.BusinessPartners
{
    public class BusinessPartnerService : IBusinessPartnerService
    {
        private readonly IBusinessPartnerRepository _repository;
        private readonly Aurora.Application.Interfaces.Common.ICodeGenerationService _codeGenService;

        public BusinessPartnerService(IBusinessPartnerRepository repository, Aurora.Application.Interfaces.Common.ICodeGenerationService codeGenService)
        {
            _repository = repository;
            _codeGenService = codeGenService;
        }

        public async Task<IEnumerable<BusinessPartnerDto>> GetAllAsync()
        {
            var result = await _repository.GetAllAsync();
            return result.Select(MapToDto);
        }

        public async Task<BusinessPartnerDto?> GetByIdAsync(Guid id)
        {
            // Note: Repository.GetByIdAsync usually finds generic, might not include owned collections eagerly strictly depending on EF config.
            // For owned types, EF Core loads them automatically by default if they are owned.
            var bp = await _repository.GetByIdAsync(id);
            return bp == null ? null : MapToDto(bp);
        }

        public async Task<BusinessPartnerDto> CreateAsync(CreateBusinessPartnerDto dto)
        {
            if (!Enum.TryParse<BusinessPartnerType>(dto.Tipo, true, out var type))
            {
                throw new ArgumentException("Invalid Business Partner Type");
            }

            var code = await _codeGenService.GenerateNextCodeAsync<BusinessPartner>("BP");

            var entity = new BusinessPartner(
                code,
                type,
                dto.RazaoSocial,
                dto.NomeFantasia,
                dto.CpfCnpj
            );

            // Add Addresses
            foreach (var addr in dto.Addresses)
            {
                var address = new Address(
                    addr.Street,
                    addr.Number,
                    addr.Complement,
                    addr.Neighborhood,
                    addr.City,
                    addr.State,
                    addr.Country,
                    addr.ZipCode
                );
                entity.AddAddress(addr.Type, address, addr.IsPrincipal);
            }

            await _repository.AddAsync(entity);

            return MapToDto(entity);
        }

        private BusinessPartnerDto MapToDto(BusinessPartner bp)
        {
            return new BusinessPartnerDto
            {
                Id = bp.Id,
                Codigo = bp.Codigo,
                Tipo = bp.Tipo.ToString(),
                RazaoSocial = bp.RazaoSocial,
                NomeFantasia = bp.NomeFantasia,
                CpfCnpj = bp.CpfCnpj,
                RgIe = bp.RgIe,
                Status = bp.Status.ToString(),
                Addresses = bp.Addresses.Select(a => new BusinessPartnerAddressDto
                {
                    Id = a.Id,
                    Type = a.Type,
                    IsPrincipal = a.IsPrincipal,
                    Street = a.Address.Street,
                    Number = a.Address.Number,
                    City = a.Address.City
                    // Map other fields...
                }).ToList(),
                Contacts = bp.Contacts.Select(c => new ContactPersonDto
                {
                    Id = c.Id,
                    Name = c.Name,
                    Email = c.Email,
                    Phone = c.Phone,
                    Role = c.Role
                }).ToList()
            };
        }
    }
}
