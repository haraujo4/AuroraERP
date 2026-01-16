using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Aurora.Application.Interfaces.Repositories;
using Aurora.Application.Interfaces.Security;
using Aurora.Domain.Entities.Security;

namespace Aurora.Application.Services.Security
{
    public class PermissionService : IPermissionService
    {
        private readonly IRepository<Permission> _permissionRepo;

        public PermissionService(IRepository<Permission> permissionRepo)
        {
            _permissionRepo = permissionRepo;
        }

        public async Task<List<PermissionDto>> GetAllAsync()
        {
            var permissions = await _permissionRepo.GetAllAsync();
            return permissions.Select(p => new PermissionDto
            {
                Id = p.Id,
                Code = p.Code,
                Name = p.Name,
                Module = p.Module,
                Transaction = p.Transaction,
                Description = p.Description
            }).ToList();
        }
    }
}
