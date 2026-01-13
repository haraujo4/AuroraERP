using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Aurora.Application.DTOs.Fiscal;
using Aurora.Domain.Entities.Fiscal;

namespace Aurora.Application.Interfaces.Fiscal
{
    public interface ITaxService
    {
        Task<TaxRule> CreateRuleAsync(CreateTaxRuleDto dto);
        Task<IEnumerable<TaxRule>> GetAllRulesAsync();
        Task<TaxCalculationResultDto> CalculateTaxAsync(TaxCalculationInputDto input);
    }
}
