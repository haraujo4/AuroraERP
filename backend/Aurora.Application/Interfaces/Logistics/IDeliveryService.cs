using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Aurora.Application.DTOs.Logistics;

namespace Aurora.Application.Interfaces.Logistics
{
    public interface IDeliveryService
    {
        Task<DeliveryDto> CreateFromOrderAsync(Guid salesOrderId);
        Task PostDeliveryAsync(Guid deliveryId);
        Task<IEnumerable<DeliveryDto>> GetAllAsync();
        Task<DeliveryDto> GetByIdAsync(Guid id);
    }
}
