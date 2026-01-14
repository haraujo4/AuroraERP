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
            // Explicitly include Contacts and Addresses
            var bp = await _repository.GetByIdAsync(id, b => b.Addresses, b => b.Contacts);
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
            entity.SetCreditLimit(0); // Default

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

            // Add Contacts
            foreach (var c in dto.Contacts)
            {
                entity.AddContact(c.Name, c.Email, c.Phone, c.Role);
            }

            await _repository.AddAsync(entity);

            return MapToDto(entity);
        }

        public async Task<BusinessPartnerDto> UpdateAsync(Guid id, CreateBusinessPartnerDto dto)
        {
             // Standard Tracked Update with Smart List Merging
             var entity = await _repository.GetByIdAsync(id, b => b.Addresses, b => b.Contacts);
             
             if (entity == null) throw new Exception("BusinessPartner not found");

             entity.UpdateDetails(dto.RazaoSocial, dto.NomeFantasia, dto.CpfCnpj, dto.RgIe);
             
             // --- Smart Update Addresses (Match by Index) ---
             int existingAddrCount = entity.Addresses.Count;
             int newAddrCount = dto.Addresses.Count;
             int maxAddr = Math.Max(existingAddrCount, newAddrCount);

             // Modify existing / Add new
             for (int i = 0; i < newAddrCount; i++)
             {
                 var addrDto = dto.Addresses[i];
                 var address = new Address(
                    addrDto.Street,
                    addrDto.Number,
                    addrDto.Complement,
                    addrDto.Neighborhood,
                    addrDto.City,
                    addrDto.State,
                    addrDto.Country,
                    addrDto.ZipCode
                 );

                 if (i < existingAddrCount)
                 {
                     entity.UpdateAddressAt(i, addrDto.Type, address, addrDto.IsPrincipal);
                 }
                 else
                 {
                     entity.AddAddress(addrDto.Type, address, addrDto.IsPrincipal);
                 }
             }

             // Remove extras (reverse loop to avoid index issues)
             for (int i = existingAddrCount - 1; i >= newAddrCount; i--)
             {
                 entity.RemoveAddressAt(i);
             }

             // --- Smart Update Contacts (Match by Index) ---
             int existingContactCount = entity.Contacts.Count;
             int newContactCount = dto.Contacts.Count;

             // Modify existing / Add new
             for (int i = 0; i < newContactCount; i++)
             {
                 var c = dto.Contacts[i];
                 if (i < existingContactCount)
                 {
                     entity.UpdateContactAt(i, c.Name, c.Email, c.Phone, c.Role);
                 }
                 else
                 {
                     entity.AddContact(c.Name, c.Email, c.Phone, c.Role);
                 }
             }

             // Remove extras
             for (int i = existingContactCount - 1; i >= newContactCount; i--)
             {
                 entity.RemoveContactAt(i);
             }
             
             await _repository.UpdateAsync(entity);
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
                    City = a.Address.City,
                    State = a.Address.State,
                    Complement = a.Address.Complement,
                    Neighborhood = a.Address.Neighborhood,
                    Country = a.Address.Country,
                    ZipCode = a.Address.ZipCode
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
