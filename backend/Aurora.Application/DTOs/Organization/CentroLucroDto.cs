using System;

namespace Aurora.Application.DTOs.Organization
{
    public class CentroLucroDto
    {
        public Guid Id { get; set; }
        public Guid EmpresaId { get; set; }
        public Guid? UnidadeNegocioId { get; set; }
        public string Codigo { get; set; }
        public string Descricao { get; set; }
        public string Responsavel { get; set; }
    }
}
