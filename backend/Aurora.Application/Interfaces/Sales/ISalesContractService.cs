using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Aurora.Application.DTOs.Sales;

namespace Aurora.Application.Interfaces.Sales
{
    public interface ISalesContractService
    {
        Task<IEnumerable<SalesContractDto>> GetAllAsync();
        Task<SalesContractDto> GetByIdAsync(Guid id);
        Task<SalesContractDto> CreateAsync(CreateSalesContractDto dto);
        Task<SalesContractDto> UpdateAsync(Guid id, UpdateSalesContractDto dto);
        Task DeleteAsync(Guid id);
        Task<SalesContractDto> UpdateStatusAsync(Guid id, string status);
    }
}
