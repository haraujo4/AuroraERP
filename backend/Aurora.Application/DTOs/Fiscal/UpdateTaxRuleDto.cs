using System;
using Aurora.Domain.Enums;

namespace Aurora.Application.DTOs.Fiscal
{
    public class UpdateTaxRuleDto
    {
        public string SourceState { get; set; }
        public string DestState { get; set; }
        public string NcmCode { get; set; } // Optional
        public OperationType OperationType { get; set; } // Sales, etc.

        // Fiscal Definition
        public int Cfop { get; set; }
        public CstIcms CstIcms { get; set; }
        
        // Rates
        public decimal IcmsRate { get; set; }
        public decimal IpiRate { get; set; }
        public decimal PisRate { get; set; }
        public decimal CofinsRate { get; set; }
    }
}
