using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Aurora.Application.DTOs.Fiscal;
using Aurora.Application.Interfaces.Fiscal;
using Aurora.Application.Interfaces.Repositories;
using Aurora.Domain.Entities.Fiscal;

namespace Aurora.Application.Services.Fiscal
{
    public class TaxService : ITaxService
    {
        private readonly ITaxRuleRepository _repository;

        public TaxService(ITaxRuleRepository repository)
        {
            _repository = repository;
        }

        public async Task<TaxRule> CreateRuleAsync(CreateTaxRuleDto dto)
        {
            var rule = new TaxRule(
                dto.SourceState,
                dto.DestState,
                dto.OperationType,
                dto.Cfop,
                dto.IcmsRate,
                dto.IpiRate,
                dto.PisRate,
                dto.CofinsRate,
                dto.CstIcms,
                dto.NcmCode
            );

            await _repository.AddAsync(rule);
            return rule;
        }

        public async Task<IEnumerable<TaxRule>> GetAllRulesAsync()
        {
            return await _repository.GetAllAsync();
        }

        public async Task<TaxRule> GetRuleByIdAsync(Guid id)
        {
            var rule = await _repository.GetByIdAsync(id);
            if (rule == null) throw new Exception("Rule not found");
            return rule;
        }

        public async Task<TaxRule> UpdateRuleAsync(Guid id, UpdateTaxRuleDto dto)
        {
            var rule = await _repository.GetByIdAsync(id);
            if (rule == null) throw new Exception("Rule not found");

            rule.Update(
                dto.SourceState,
                dto.DestState,
                dto.OperationType,
                dto.Cfop,
                dto.IcmsRate,
                dto.IpiRate,
                dto.PisRate,
                dto.CofinsRate,
                dto.CstIcms,
                dto.NcmCode
            );

            await _repository.UpdateAsync(rule);
            return rule;
        }

        public async Task<TaxCalculationResultDto> CalculateTaxAsync(TaxCalculationInputDto input)
        {
            // Naive implementation: Fetch all and filter in memory (efficient enough for < 1000 rules)
            // In production, build a specific query in Repository
            var rules = await _repository.GetAllAsync();

            var rule = rules
                .Where(r => r.SourceState == input.SourceState && 
                            r.DestState == input.DestState && 
                            r.OperationType == input.OperationType &&
                            (string.IsNullOrEmpty(r.NcmCode) || r.NcmCode == input.NcmCode))
                .OrderByDescending(r => r.NcmCode == input.NcmCode) // Exact match (true) comes first
                .FirstOrDefault();

            if (rule == null)
            {
                // Fallback: Return zero taxes if no rule found
                return new TaxCalculationResultDto
                {
                    Cfop = 0,
                    CstIcms = 0
                };
            }

            return new TaxCalculationResultDto
            {
                Cfop = rule.Cfop,
                CstIcms = (int)rule.CstIcms,
                
                IcmsRate = rule.IcmsRate,
                IcmsAmount = input.ItemValue * (rule.IcmsRate / 100m),

                IpiRate = rule.IpiRate,
                IpiAmount = input.ItemValue * (rule.IpiRate / 100m),

                PisRate = rule.PisRate,
                PisAmount = input.ItemValue * (rule.PisRate / 100m),

                CofinsRate = rule.CofinsRate,
                CofinsAmount = input.ItemValue * (rule.CofinsRate / 100m),

                TotalTaxAmount = (input.ItemValue * (rule.IcmsRate / 100m)) +
                                 (input.ItemValue * (rule.IpiRate / 100m)) +
                                 (input.ItemValue * (rule.PisRate / 100m)) +
                                 (input.ItemValue * (rule.CofinsRate / 100m))
            };
        }
    }
}
