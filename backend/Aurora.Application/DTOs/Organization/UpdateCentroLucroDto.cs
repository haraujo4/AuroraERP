using System;

namespace Aurora.Application.DTOs.Organization
{
    public class UpdateCentroLucroDto
    {
        public string Descricao { get; set; }
        public string Responsavel { get; set; }
        public Guid? UnidadeNegocioId { get; set; }
    }
}
