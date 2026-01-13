using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Aurora.Domain.Entities.Logistics;

namespace Aurora.Application.Interfaces.Repositories.Logistics
{
    public interface IDeliveryRepository : IRepository<Delivery>
    {
        Task<IEnumerable<Delivery>> GetAllWithDetailsAsync();
        Task<Delivery> GetByIdWithDetailsAsync(Guid id);
    }
}
