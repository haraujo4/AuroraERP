using System;
using Aurora.Domain.Common;

namespace Aurora.Domain.Entities.Organization
{
    public class CentroCusto : BaseEntity
    {
        public Guid EmpresaId { get; private set; }
        public Empresa Empresa { get; private set; }

        public string Codigo { get; private set; }
        public string Descricao { get; private set; }
        public string Responsavel { get; private set; }
        public Guid? HierarquiaPaiId { get; private set; } 
        // Self-referencing relationship would be configured in EF Core context

        public DateTime ValidadeInicio { get; private set; }
        public DateTime? ValidadeFim { get; private set; }

        public CentroCusto(string codigo, string descricao, string responsavel, Guid empresaId)
        {
            Codigo = codigo;
            Descricao = descricao;
            Responsavel = responsavel;
            EmpresaId = empresaId;
            ValidadeInicio = DateTime.UtcNow;
        }

        private CentroCusto() 
        { 
            Codigo = null!;
            Descricao = null!;
            Responsavel = null!;
            Empresa = null!;
        }
    }
}
