using System;
using Aurora.Domain.Enums;

namespace Aurora.Application.DTOs.Fiscal
{
    public class CreateTaxRuleDto
    {
        public string SourceState { get; set; }
        public string DestState { get; set; }
        public string? NcmCode { get; set; }
        public OperationType OperationType { get; set; }
        public int Cfop { get; set; }
        public CstIcms CstIcms { get; set; }
        public decimal IcmsRate { get; set; }
        public decimal IpiRate { get; set; }
        public decimal PisRate { get; set; }
        public decimal CofinsRate { get; set; }
    }

    public class TaxRuleDto : CreateTaxRuleDto
    {
        public Guid Id { get; set; }
    }

    public class TaxCalculationInputDto
    {
        public string SourceState { get; set; }
        public string DestState { get; set; }
        public string? NcmCode { get; set; }
        public OperationType OperationType { get; set; }
        public decimal ItemValue { get; set; }
    }

    public class TaxCalculationResultDto
    {
        public int Cfop { get; set; }
        public int CstIcms { get; set; }
        
        public decimal IcmsRate { get; set; }
        public decimal IcmsAmount { get; set; }
        
        public decimal IpiRate { get; set; }
        public decimal IpiAmount { get; set; }
        
        public decimal PisRate { get; set; }
        public decimal PisAmount { get; set; }
        
        public decimal CofinsRate { get; set; }
        public decimal CofinsAmount { get; set; }

        public decimal TotalTaxAmount { get; set; }
    }
}
