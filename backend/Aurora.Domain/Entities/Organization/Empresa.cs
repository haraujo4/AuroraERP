using System;
using System.Collections.Generic;
using Aurora.Domain.Common;
using Aurora.Domain.ValueObjects;

namespace Aurora.Domain.Entities.Organization
{
    public class Empresa : BaseEntity
    {
        public Guid GrupoEmpresarialId { get; private set; }
        public GrupoEmpresarial GrupoEmpresarial { get; private set; }

        public string Codigo { get; private set; }
        public string RazaoSocial { get; private set; }
        public string NomeFantasia { get; private set; }
        public string CNPJ { get; private set; }
        public string? InscricaoEstadual { get; private set; }
        public string? InscricaoMunicipal { get; private set; }
        public string? CNAEPrincipal { get; private set; }
        public string? NaturezaJuridica { get; private set; }
        public string? RegimeTributario { get; private set; }

        public Address EnderecoFiscal { get; private set; }
        
        // Financial Configs
        public string? MoedaLocal { get; private set; }
        
        private readonly List<Filial> _filiais = new List<Filial>();
        public IReadOnlyCollection<Filial> Filiais => _filiais.AsReadOnly();

        public Empresa(string codigo, string razaoSocial, string nomeFantasia, string cnpj, Address endereco, Guid grupoId)
        {
            Codigo = codigo;
            RazaoSocial = razaoSocial;
            NomeFantasia = nomeFantasia;
            CNPJ = cnpj;
            EnderecoFiscal = endereco;
            GrupoEmpresarialId = grupoId;
        }

        // EF Core
        private Empresa() 
        {
            Codigo = null!;
            RazaoSocial = null!;
            NomeFantasia = null!;
            CNPJ = null!;
            InscricaoEstadual = null!;
            InscricaoMunicipal = null!;
            CNAEPrincipal = null!;
            NaturezaJuridica = null!;
            RegimeTributario = null!;
            EnderecoFiscal = null!;
            MoedaLocal = null!;
            GrupoEmpresarial = null!;
        }
    }
}
