using System;

namespace Aurora.Application.DTOs.Organization
{
    public class CentroCustoDto
    {
        public Guid Id { get; set; }
        public Guid EmpresaId { get; set; }
        public string Codigo { get; set; }
        public string Descricao { get; set; }
        public string Responsavel { get; set; }
        public Guid? HierarquiaPaiId { get; set; }
        public DateTime ValidadeInicio { get; set; }
        public DateTime? ValidadeFim { get; set; }
    }
}
