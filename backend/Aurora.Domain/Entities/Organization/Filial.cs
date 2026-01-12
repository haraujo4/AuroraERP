using System;
using System.Collections.Generic;
using Aurora.Domain.Common;
using Aurora.Domain.ValueObjects;

namespace Aurora.Domain.Entities.Organization
{
    public class Filial : BaseEntity
    {
        public Guid EmpresaId { get; private set; }
        public Empresa Empresa { get; private set; }

        public string Codigo { get; private set; }
        public string Descricao { get; private set; }
        public Address EnderecoOperacional { get; private set; }
        public string Tipo { get; private set; } // Industrial, Comercial, Servico

        private readonly List<Deposito> _depositos = new List<Deposito>();
        public IReadOnlyCollection<Deposito> Depositos => _depositos.AsReadOnly();

        public Filial(string codigo, string descricao, string tipo, Address endereco, Guid empresaId)
        {
            Codigo = codigo;
            Descricao = descricao;
            Tipo = tipo;
            EnderecoOperacional = endereco;
            EmpresaId = empresaId;
        }

        private Filial() 
        { 
            Codigo = null!;
            Descricao = null!;
            Tipo = null!;
            EnderecoOperacional = null!;
            Empresa = null!;
        }
        public void Update(string codigo, string descricao, string tipo, Address endereco, Guid empresaId)
        {
            Codigo = codigo;
            Descricao = descricao;
            Tipo = tipo;
            EnderecoOperacional = endereco;
            EmpresaId = empresaId;
        }
    }
}
