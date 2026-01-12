using System;
using System.Collections.Generic;
using Aurora.Domain.Common;
using Aurora.Domain.ValueObjects;

namespace Aurora.Domain.Entities.BusinessPartners
{
    public enum BusinessPartnerType
    {
        PessoaFisica,
        PessoaJuridica
    }

    public enum BusinessPartnerStatus
    {
        Active,
        Blocked,
        Inactive
    }

    public class BusinessPartner : BaseEntity
    {
        public string Codigo { get; private set; }
        public BusinessPartnerType Tipo { get; private set; }
        public string RazaoSocial { get; private set; } // Or Name
        public string NomeFantasia { get; private set; }
        public BusinessPartnerStatus Status { get; private set; }
        
        // Documents
        public string CpfCnpj { get; private set; }
        public string? RgIe { get; private set; }
        
        // Commercial
        public decimal LimiteCredito { get; private set; }
        public bool BloqueadoFinanceiro { get; private set; }

        // Addresses
        private readonly List<BusinessPartnerAddress> _addresses = new();
        public IReadOnlyCollection<BusinessPartnerAddress> Addresses => _addresses.AsReadOnly();

        // Contact Persons
        private readonly List<ContactPerson> _contacts = new();
        public IReadOnlyCollection<ContactPerson> Contacts => _contacts.AsReadOnly();

        private BusinessPartner() { } // EF Core

        public BusinessPartner(string codigo, BusinessPartnerType tipo, string razaoSocial, string nomeFantasia, string cpfCnpj)
        {
            Codigo = codigo;
            Tipo = tipo;
            RazaoSocial = razaoSocial;
            NomeFantasia = nomeFantasia;
            CpfCnpj = cpfCnpj;
            Status = BusinessPartnerStatus.Active;
        }

        public void AddAddress(string type, Address address, bool isPrincipal = false)
        {
            _addresses.Add(new BusinessPartnerAddress(type, address, isPrincipal));
        }

        public void AddContact(string name, string email, string phone, string role)
        {
            _contacts.Add(new ContactPerson(name, email, phone, role));
        }
        
        public void SetCreditLimit(decimal limit)
        {
             LimiteCredito = limit;
        }
    }

    public class BusinessPartnerAddress
    {
        public Guid Id { get; private set; }
        public string Type { get; private set; } // Fiscal, Delivery, Billing
        public Address Address { get; private set; }
        public bool IsPrincipal { get; private set; }

        private BusinessPartnerAddress() { }

        public BusinessPartnerAddress(string type, Address address, bool isPrincipal)
        {
            Id = Guid.NewGuid();
            Type = type;
            Address = address;
            IsPrincipal = isPrincipal;
        }
    }

    public class ContactPerson
    {
        public Guid Id { get; private set; }
        public string Name { get; private set; }
        public string Email { get; private set; }
        public string Phone { get; private set; }
        public string Role { get; private set; }

        private ContactPerson() { }

        public ContactPerson(string name, string email, string phone, string role)
        {
            Id = Guid.NewGuid();
            Name = name;
            Email = email;
            Phone = phone;
            Role = role;
        }
    }
}
