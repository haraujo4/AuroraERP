using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Aurora.Application.Interfaces.Security;
using Aurora.Domain.ValueObjects;
using Microsoft.Extensions.DependencyInjection;

namespace Aurora.Infrastructure.Persistence
{
    public static class DataSeeder
    {
        public static async Task SeedAllAsync(IServiceProvider serviceProvider)
        {
            using var scope = serviceProvider.CreateScope();
            var authService = scope.ServiceProvider.GetRequiredService<IAuthService>();
            var context = scope.ServiceProvider.GetRequiredService<AuroraDbContext>();

            // 1. Seed Roles & Admin User
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

            // 2. Seed Organization (Minimum for Integration)
            if (!context.GruposEmpresariais.Any())
            {
                var grupo = new Aurora.Domain.Entities.Organization.GrupoEmpresarial("ORG01", "Aurora Group Consolidado", "Aurora Group", "Brasil", "BRL", "PT-BR", "Lucro Real");
                context.GruposEmpresariais.Add(grupo);
                await context.SaveChangesAsync();

                var address = new Address("Av. Brasil", "1000", null, "Centro", "São Paulo", "SP", "Brasil", "01001000");
                var empresa = new Aurora.Domain.Entities.Organization.Empresa("EMP01", "Aurora Matriz LTDA", "Aurora Matriz", "12345678000199", address, grupo.Id);
                context.Empresas.Add(empresa);
                await context.SaveChangesAsync();

                var filial = new Aurora.Domain.Entities.Organization.Filial("FIL01", "Filial Principal", "Operacional", address, empresa.Id);
                context.Filiais.Add(filial);
                await context.SaveChangesAsync();
            }

            // 3. Seed Accounts for Logistics Integration
            if (!context.Accounts.Any())
            {
                // Assets (Inventory)
                var inventoryAcct = new Aurora.Domain.Entities.Finance.Account("1.1.01", "Estoques de Materiais", Aurora.Domain.Enums.AccountType.Asset, Aurora.Domain.Enums.AccountNature.Debit, 3);
                context.Accounts.Add(inventoryAcct);

                // Liabilities (GR/IR - Mercadorias a Receber / Faturas a Receber)
                var grirAcct = new Aurora.Domain.Entities.Finance.Account("2.1.01", "Fornecedores - Mercadorias Entregues", Aurora.Domain.Enums.AccountType.Liability, Aurora.Domain.Enums.AccountNature.Credit, 3);
                context.Accounts.Add(grirAcct);

                // Expenses (COGS - CMV)
                var cogsAcct = new Aurora.Domain.Entities.Finance.Account("3.1.01", "Custo das Mercadorias Vendidas (CMV)", Aurora.Domain.Enums.AccountType.Expense, Aurora.Domain.Enums.AccountNature.Debit, 3);
                context.Accounts.Add(cogsAcct);

                await context.SaveChangesAsync();
            }
        }
    }
}
