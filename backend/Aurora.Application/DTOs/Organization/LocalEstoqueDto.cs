using System;

namespace Aurora.Application.DTOs.Organization
{
    public class LocalEstoqueDto
    {
        public Guid Id { get; set; }
        public Guid DepositoId { get; set; }
        public string Codigo { get; set; }
        public string Tipo { get; set; }
        public bool PermitePicking { get; set; }
        public bool PermiteInventario { get; set; }
    }
}
