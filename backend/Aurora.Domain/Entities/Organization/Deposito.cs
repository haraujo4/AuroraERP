using System;
using System.Collections.Generic;
using Aurora.Domain.Common;
using Aurora.Domain.ValueObjects;

namespace Aurora.Domain.Entities.Organization
{
    public class Deposito : BaseEntity
    {
        public Guid FilialId { get; private set; }
        public Filial Filial { get; private set; }

        public string Codigo { get; private set; }
        public string Descricao { get; private set; }
        public Address EnderecoFisico { get; private set; }
        public string Tipo { get; private set; } // MP, PA, MRO
        public bool ControlaLote { get; private set; }
        public bool ControlaSerie { get; private set; }

        private readonly List<LocalEstoque> _locais = new List<LocalEstoque>();
        public IReadOnlyCollection<LocalEstoque> Locais => _locais.AsReadOnly();

        public Deposito(string codigo, string descricao, string tipo, bool controlaLote, bool controlaSerie, Guid filialId)
        {
            Codigo = codigo;
            Descricao = descricao;
            Tipo = tipo;
            ControlaLote = controlaLote;
            ControlaSerie = controlaSerie;
            FilialId = filialId;
            // Initialize with empty address to avoid null value object issues
            EnderecoFisico = new Address("", "", "", "", "", "", "", "");
        }

        private Deposito() 
        {
            Codigo = null!;
            Descricao = null!;
            Tipo = null!;
            EnderecoFisico = null!;
            Filial = null!;
        }
    }
}
