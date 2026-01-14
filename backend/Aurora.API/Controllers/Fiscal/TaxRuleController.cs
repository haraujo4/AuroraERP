using System;
using System.Threading.Tasks;
using Aurora.Application.DTOs.Fiscal;
using Aurora.Application.Interfaces.Fiscal;
using Microsoft.AspNetCore.Mvc;

namespace Aurora.API.Controllers.Fiscal
{
    [ApiController]
    [Route("api/fiscal")]
    public class TaxRuleController : ControllerBase
    {
        private readonly ITaxService _taxService;

        public TaxRuleController(ITaxService taxService)
        {
            _taxService = taxService;
        }

        [HttpPost("tax-rules")]
        public async Task<IActionResult> CreateRule([FromBody] CreateTaxRuleDto dto)
        {
            var rule = await _taxService.CreateRuleAsync(dto);
            return CreatedAtAction(nameof(GetRules), new { id = rule.Id }, rule);
        }

        [HttpGet("tax-rules")]
        public async Task<IActionResult> GetRules()
        {
            var rules = await _taxService.GetAllRulesAsync();
            return Ok(rules);
        }
        [HttpGet("tax-rules/{id}")]
        public async Task<IActionResult> GetRuleById(Guid id)
        {
            try
            {
                var rule = await _taxService.GetRuleByIdAsync(id);
                return Ok(rule);
            }
            catch
            {
                return NotFound();
            }
        }

        [HttpPut("tax-rules/{id}")]
        public async Task<IActionResult> UpdateRule(Guid id, [FromBody] UpdateTaxRuleDto dto)
        {
            try
            {
                var rule = await _taxService.UpdateRuleAsync(id, dto);
                return Ok(rule);
            }
            catch(Exception ex)
            {
               return BadRequest(ex.Message);
            }
        }

        [HttpPost("calculate")]
        public async Task<IActionResult> CalculateTax([FromBody] TaxCalculationInputDto input)
        {
            var result = await _taxService.CalculateTaxAsync(input);
            return Ok(result);
        }
    }
}
