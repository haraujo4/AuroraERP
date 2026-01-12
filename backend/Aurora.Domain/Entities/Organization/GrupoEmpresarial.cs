using System;
using System.Collections.Generic;
using Aurora.Domain.Common;

namespace Aurora.Domain.Entities.Organization
{
    public class GrupoEmpresarial : BaseEntity
    {
        public string Codigo { get; private set; }
        public string RazaoSocialConsolidada { get; private set; }
        public string NomeFantasia { get; private set; }
        public string PaisConsolidacao { get; private set; }
        public string MoedaBase { get; private set; } // ISO Code
        public string IdiomaPadrao { get; private set; }
        public string RegimeFiscalConsolidado { get; private set; }

        private readonly List<Empresa> _empresas = new List<Empresa>();
        public IReadOnlyCollection<Empresa> Empresas => _empresas.AsReadOnly();

        public GrupoEmpresarial(string codigo, string razaoSocial, string nomeFantasia, string pais, string moeda, string idioma, string regimeFiscal)
        {
            Codigo = codigo;
            RazaoSocialConsolidada = razaoSocial;
            NomeFantasia = nomeFantasia;
            PaisConsolidacao = pais;
            MoedaBase = moeda;
            IdiomaPadrao = idioma;
            RegimeFiscalConsolidado = regimeFiscal;
        }

        // Logic to add companies could go here

        private GrupoEmpresarial() 
        { 
            Codigo = null!;
            RazaoSocialConsolidada = null!;
            NomeFantasia = null!;
            PaisConsolidacao = null!;
            MoedaBase = null!;
            IdiomaPadrao = null!;
            RegimeFiscalConsolidado = null!;
        }
    }
}
