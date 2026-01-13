using System;

namespace Aurora.Application.DTOs.Organization
{
    public class UpdateLocalEstoqueDto
    {
        public string Tipo { get; set; }
        public bool PermitePicking { get; set; }
        public bool PermiteInventario { get; set; }
    }
}
