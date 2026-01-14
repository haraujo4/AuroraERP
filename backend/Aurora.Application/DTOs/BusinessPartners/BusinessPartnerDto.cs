using System;
using System.Collections.Generic;

namespace Aurora.Application.DTOs.BusinessPartners
{
    public class BusinessPartnerDto
    {
        public Guid Id { get; set; }
        public string Codigo { get; set; }
        public string Tipo { get; set; }
        public string RazaoSocial { get; set; }
        public string NomeFantasia { get; set; }
        public string CpfCnpj { get; set; }
        public string RgIe { get; set; }
        public string Status { get; set; }
        public List<BusinessPartnerAddressDto> Addresses { get; set; } = new();
        public List<ContactPersonDto> Contacts { get; set; } = new();
    }

    public class CreateBusinessPartnerDto
    {
        public string Codigo { get; set; }
        public string Tipo { get; set; } // PessoaFisica, PessoaJuridica
        public string RazaoSocial { get; set; }
        public string NomeFantasia { get; set; }
        public string CpfCnpj { get; set; }
        public string RgIe { get; set; }
        public List<CreateAddressDto> Addresses { get; set; } = new();
        public List<CreateContactDto> Contacts { get; set; } = new();
    }

    public class CreateContactDto
    {
        public string Name { get; set; }
        public string Email { get; set; }
        public string Phone { get; set; }
        public string Role { get; set; }
    }

    public class BusinessPartnerAddressDto
    {
        public Guid Id { get; set; }
        public string Type { get; set; }
        public bool IsPrincipal { get; set; }
        public string Street { get; set; }
        public string Number { get; set; }
        public string City { get; set; }
        public string State { get; set; }
        public string? Complement { get; set; }
        public string? Neighborhood { get; set; }
        public string? Country { get; set; }
        public string ZipCode { get; set; }
    }

     public class CreateAddressDto
    {
        public string Type { get; set; }
        public bool IsPrincipal { get; set; }
        public string Street { get; set; }
        public string Number { get; set; }
        public string? Complement { get; set; }
        public string? Neighborhood { get; set; }
        public string City { get; set; }
        public string State { get; set; }
        public string? Country { get; set; }
        public string ZipCode { get; set; }
    }

    public class ContactPersonDto
    {
        public Guid Id { get; set; }
        public string Name { get; set; }
        public string Email { get; set; }
        public string Phone { get; set; }
        public string Role { get; set; }
    }
}
