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

        public void UpdateDetails(string razaoSocial, string nomeFantasia, string cpfCnpj, string? rgIe)
        {
            RazaoSocial = razaoSocial;
            NomeFantasia = nomeFantasia;
            CpfCnpj = cpfCnpj;
            RgIe = rgIe;
            UpdatedAt = DateTime.UtcNow;
        }

        public void UpdateAddress(Guid addressId, string type, Address address, bool isPrincipal)
        {
            var existing = _addresses.FirstOrDefault(a => a.Id == addressId);
            if (existing != null)
            {
                // Since properties are private set, and we don't have update methods on the child class (unless we add them), 
                // we might need to remove and insert at specific index, OR add update methods to BusinessPartnerAddress.
                // But BusinessPartnerAddress is defined below. I can update it there. Or here if I add methods to it.
                // Let's add Update method to BusinessPartnerAddress class below first.
                // existing.Update(type, address, isPrincipal);
            }
        }
        
        // Actually, since I don't have IDs from frontend, I will use Index-based update.
        public void UpdateAddressAt(int index, string type, Address address, bool isPrincipal)
        {
            if (index >= 0 && index < _addresses.Count)
            {
                var existing = _addresses[index];
                // Need to add Update method to BusinessPartnerAddress
                existing.Update(type, address, isPrincipal);
            }
        }

        public void RemoveAddressAt(int index)
        {
             if (index >= 0 && index < _addresses.Count)
            {
                _addresses.RemoveAt(index);
            }
        }

        public void UpdateContactAt(int index, string name, string email, string phone, string role)
        {
            if (index >= 0 && index < _contacts.Count)
            {
                var existing = _contacts[index];
                existing.Update(name, email, phone, role);
            }
        }

        public void RemoveContactAt(int index)
        {
             if (index >= 0 && index < _contacts.Count)
            {
                _contacts.RemoveAt(index);
            }
        }
    
        public void ClearContacts()
        {
            _contacts.Clear();
        }

        public void ClearAddresses()
        {
            _addresses.Clear();
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

        public void Update(string type, Address address, bool isPrincipal)
        {
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

        public void Update(string name, string email, string phone, string role)
        {
            Name = name;
            Email = email;
            Phone = phone;
            Role = role;
        }
    }
}
