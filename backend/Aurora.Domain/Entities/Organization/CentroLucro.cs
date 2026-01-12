using System;
using Aurora.Domain.Common;

namespace Aurora.Domain.Entities.Organization
{
    public class CentroLucro : BaseEntity
    {
        public Guid EmpresaId { get; private set; }
        public Empresa Empresa { get; private set; }
        
        public Guid? UnidadeNegocioId { get; private set; }

        public string Codigo { get; private set; }
        public string Descricao { get; private set; }
        public string Responsavel { get; private set; }

        public CentroLucro(string codigo, string descricao, string responsavel, Guid empresaId)
        {
            Codigo = codigo;
            Descricao = descricao;
            Responsavel = responsavel;
            EmpresaId = empresaId;
        }

        private CentroLucro() 
        { 
            Codigo = null!;
            Descricao = null!;
            Responsavel = null!;
            Empresa = null!;
        }
    }
}
