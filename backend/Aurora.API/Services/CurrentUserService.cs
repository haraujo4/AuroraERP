using System.Security.Claims;
using Aurora.Application.Interfaces.Security;
using Microsoft.AspNetCore.Http;

namespace Aurora.API.Services
{
    public class CurrentUserService : ICurrentUserService
    {
        private readonly IHttpContextAccessor _httpContextAccessor;

        public CurrentUserService(IHttpContextAccessor httpContextAccessor)
        {
            _httpContextAccessor = httpContextAccessor;
        }

        public string? UserId => _httpContextAccessor.HttpContext?.User?.FindFirstValue(ClaimTypes.NameIdentifier);
        public string? Username => _httpContextAccessor.HttpContext?.User?.Identity?.Name;
    }
}
