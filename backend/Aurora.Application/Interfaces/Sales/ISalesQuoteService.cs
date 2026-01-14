using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Aurora.Application.DTOs.Sales;

namespace Aurora.Application.Interfaces.Sales
{
    public interface ISalesQuoteService
    {
        Task<IEnumerable<SalesQuoteDto>> GetAllAsync();
        Task<SalesQuoteDto> GetByIdAsync(Guid id);
        Task<SalesQuoteDto> CreateAsync(CreateSalesQuoteDto dto);
        Task UpdateStatusAsync(Guid id, string status);
        Task<SimulatedTaxResultDto> SimulateTaxAsync(SimulateTaxDto dto);
    }
}
