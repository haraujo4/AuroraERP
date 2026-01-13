using System;

namespace Aurora.Application.DTOs.Organization
{
    public class UpdateDepositoDto
    {
        public string Descricao { get; set; }
        public string Tipo { get; set; }
        public bool ControlaLote { get; set; }
        public bool ControlaSerie { get; set; }
    }
}
