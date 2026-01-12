using System;

namespace Aurora.Application.DTOs.Organization
{
    public class EmpresaDto
    {
        public Guid Id { get; set; }
        public Guid GrupoEmpresarialId { get; set; }
        public string Codigo { get; set; } = string.Empty;
        public string RazaoSocial { get; set; } = string.Empty;
        public string NomeFantasia { get; set; } = string.Empty;
        public string CNPJ { get; set; } = string.Empty;
        public AddressDto EnderecoFiscal { get; set; } = new();
        public bool IsActive { get; set; }
    }

    public class CreateEmpresaDto
    {
        public Guid GrupoEmpresarialId { get; set; }
        public string Codigo { get; set; } = string.Empty;
        public string RazaoSocial { get; set; } = string.Empty;
        public string NomeFantasia { get; set; } = string.Empty;
        public string CNPJ { get; set; } = string.Empty;
        public string InscricaoEstadual { get; set; } = string.Empty;
        public string InscricaoMunicipal { get; set; } = string.Empty;
        public string CNAEPrincipal { get; set; } = string.Empty;
        public string NaturezaJuridica { get; set; } = string.Empty;
        public string RegimeTributario { get; set; } = string.Empty;
        public AddressDto EnderecoFiscal { get; set; } = new();
        public string MoedaLocal { get; set; } = string.Empty;
    }

    public class AddressDto
    {
        public string Street { get; set; } = string.Empty;
        public string Number { get; set; } = string.Empty;
        public string Complement { get; set; } = string.Empty;
        public string Neighborhood { get; set; } = string.Empty;
        public string City { get; set; } = string.Empty;
        public string State { get; set; } = string.Empty;
        public string Country { get; set; } = string.Empty;
        public string ZipCode { get; set; } = string.Empty;
    }
}
