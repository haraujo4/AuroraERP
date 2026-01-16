using System;
using Aurora.Domain.Common;

namespace Aurora.Domain.Entities.Organization
{
    public class LocalEstoque : BaseEntity
    {
        public Guid DepositoId { get; private set; }
        public Deposito Deposito { get; private set; }

        public string Codigo { get; private set; }
        public string Tipo { get; private set; }
        public bool PermitePicking { get; private set; }
        public bool PermiteInventario { get; private set; }

        public string? Rua { get; private set; }
        public string? Prateleira { get; private set; }
        public string? Nivel { get; private set; }

        public LocalEstoque(string codigo, string tipo, bool permitePicking, bool permiteInventario, Guid depositoId, string? rua = null, string? prateleira = null, string? nivel = null)
        {
            Codigo = codigo;
            Tipo = tipo;
            PermitePicking = permitePicking;
            PermiteInventario = permiteInventario;
            DepositoId = depositoId;
            Rua = rua;
            Prateleira = prateleira;
            Nivel = nivel;
        }

        private LocalEstoque() 
        { 
            Codigo = null!;
            Tipo = null!;
            Deposito = null!;
        }
    }
}
