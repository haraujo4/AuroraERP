using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Aurora.Application.Interfaces.Security;
using Microsoft.Extensions.DependencyInjection;

namespace Aurora.Infrastructure.Persistence
{
    public static class DataSeeder
    {
        public static async Task SeedUsersAsync(IServiceProvider serviceProvider)
        {
            using var scope = serviceProvider.CreateScope();
            var authService = scope.ServiceProvider.GetRequiredService<IAuthService>();
            var context = scope.ServiceProvider.GetRequiredService<AuroraDbContext>();

            if (!context.Users.Any())
            {
                await authService.RegisterAsync(new RegisterRequestDto
                {
                    Username = "admin",
                    Email = "admin@aurora.com",
                    Password = "admin123",
                    Roles = new List<string> { "ADMIN" }
                });
            }
        }
    }
}
