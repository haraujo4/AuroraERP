using System;

namespace Aurora.Application.DTOs.Organization
{
    public class UpdateCentroCustoDto
    {
        public string Descricao { get; set; }
        public string Responsavel { get; set; }
        public Guid? HierarquiaPaiId { get; set; }
        public DateTime? ValidadeFim { get; set; }
    }
}
