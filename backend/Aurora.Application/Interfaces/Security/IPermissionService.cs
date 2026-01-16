using System.Collections.Generic;
using System.Threading.Tasks;
using Aurora.Domain.Entities.Security;

namespace Aurora.Application.Interfaces.Security
{
    public interface IPermissionService
    {
        Task<List<PermissionDto>> GetAllAsync();
    }

    public class PermissionDto
    {
        public Guid Id { get; set; }
        public string Code { get; set; } = string.Empty;
        public string Name { get; set; } = string.Empty;
        public string Module { get; set; } = string.Empty;
        public string Transaction { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
    }
}
