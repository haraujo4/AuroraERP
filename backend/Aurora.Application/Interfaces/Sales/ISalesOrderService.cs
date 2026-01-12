using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Aurora.Application.DTOs.Sales;

namespace Aurora.Application.Interfaces.Sales
{
    public interface ISalesOrderService
    {
        Task<IEnumerable<SalesOrderDto>> GetAllAsync();
        Task<SalesOrderDto> GetByIdAsync(Guid id);
        Task<SalesOrderDto> CreateAsync(CreateSalesOrderDto dto);
        Task<SalesOrderDto> CreateFromQuoteAsync(Guid quoteId);
        Task UpdateStatusAsync(Guid id, string status);
    }
}
