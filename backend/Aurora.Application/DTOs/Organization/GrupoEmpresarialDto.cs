using System;

namespace Aurora.Application.DTOs.Organization
{
    public class GrupoEmpresarialDto
    {
        public Guid Id { get; set; }
        public string Codigo { get; set; } = string.Empty;
        public string RazaoSocialConsolidada { get; set; } = string.Empty;
        public string NomeFantasia { get; set; } = string.Empty;
        public string PaisConsolidacao { get; set; } = string.Empty;
        public string MoedaBase { get; set; } = string.Empty;
        public string IdiomaPadrao { get; set; } = string.Empty;
        public string RegimeFiscalConsolidado { get; set; } = string.Empty;
        public bool IsActive { get; set; }
    }

    public class CreateGrupoEmpresarialDto
    {
        public string Codigo { get; set; } = string.Empty;
        public string RazaoSocialConsolidada { get; set; } = string.Empty;
        public string NomeFantasia { get; set; } = string.Empty;
        public string PaisConsolidacao { get; set; } = string.Empty;
        public string MoedaBase { get; set; } = string.Empty;
        public string IdiomaPadrao { get; set; } = string.Empty;
        public string RegimeFiscalConsolidado { get; set; } = string.Empty;
    }
    
    public class UpdateGrupoEmpresarialDto
    {
        public string RazaoSocialConsolidada { get; set; } = string.Empty;
        public string NomeFantasia { get; set; } = string.Empty;
        public string RegimeFiscalConsolidado { get; set; } = string.Empty;
    }
}
