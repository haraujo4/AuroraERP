using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Aurora.Application.Interfaces.Security;
using Aurora.Domain.ValueObjects;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.EntityFrameworkCore; // Added for FirstOrDefaultAsync

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

            // 4. Ensure Revenue/Receivable Accounts exist (Fix for existing databases)
            if (!context.Accounts.Any(a => a.Type == Aurora.Domain.Enums.AccountType.Revenue))
            {
                var revenueAcct = new Aurora.Domain.Entities.Finance.Account("4.1.01", "Receita de Vendas", Aurora.Domain.Enums.AccountType.Revenue, Aurora.Domain.Enums.AccountNature.Credit, 3);
                context.Accounts.Add(revenueAcct);
            }

            if (!context.Accounts.Any(a => a.Name.Contains("Clientes")))
            {
                var receivableAcct = new Aurora.Domain.Entities.Finance.Account("1.1.02", "Clientes", Aurora.Domain.Enums.AccountType.Asset, Aurora.Domain.Enums.AccountNature.Debit, 3);
                context.Accounts.Add(receivableAcct);
                await context.SaveChangesAsync();
            }

            // 5. Seed Permissions
            if (!context.Permissions.Any())
            {
                var permissions = new List<Aurora.Domain.Entities.Security.Permission>
                {
                    // Logistics
                    new("LO_PO_CREATE", "Create Purchase Order", "Logistics", "ME21N", "Allows creating purchase orders"),
                    new("LO_PO_APPROVE", "Approve Purchase Order", "Logistics", "ME29N", "Allows approving purchase orders"),
                    new("LO_MIGO_VIEW", "View Goods Movement", "Logistics", "MIGO", "Allows viewing goods movements"),
                    new("LO_MIGO_POST", "Post Goods Movement", "Logistics", "MIGO", "Allows posting goods movements"),
                    
                    // Finance
                    new("FI_INV_CREATE", "Create Invoice", "Finance", "MIRO", "Allows creating supplier invoices"),
                    new("FI_INV_POST", "Post Invoice", "Finance", "MIRO", "Allows posting supplier invoices"),
                    new("FI_PAY_RUN", "Execute Payment Run", "Finance", "F110", "Allows executing payment runs"),
                    new("FI_JE_CREATE", "Create Journal Entry", "Finance", "FB50", "Allows creating journal entries"),
                
                    // Sales
                    new("SD_SO_CREATE", "Create Sales Order", "Sales", "VA01", "Allows creating sales orders"),
                    new("SD_SO_APPROVE", "Approve Sales Order", "Sales", "VA02", "Allows approving sales orders"),

                    // HR
                    new("HR_EMP_VIEW", "View Employee", "Human Resources", "PA30", "Allows viewing employee data"),
                    new("HR_PA40", "Personnel Actions", "Human Resources", "PA40", "Allows performing personnel actions (Hiring, Firing)"),
                    new("HR_PA61", "Time Management", "Human Resources", "PA61", "Allows managing time records"),

                    // Fiscal
                    new("FIS_TAX_VIEW", "View Tax Rules", "Fiscal", "J1BTAX", "Allows viewing tax rules"),
                    new("FIS_TAX_EDIT", "Edit Tax Rules", "Fiscal", "J1BTAX", "Allows editing tax rules"),
                    new("FIS_NFE_VIEW", "View NFe", "Fiscal", "J1BNFE", "Allows viewing NFe monitor"),
                    new("FIS_NFE_CANCEL", "Cancel NFe", "Fiscal", "J1BNFE", "Allows cancelling NFes"),

                    // Admin
                    new("ADM_ACCESS_MANAGE", "Manage Access", "Administration", "SU01", "Allows managing users, roles and permissions"),
                };

                context.Permissions.AddRange(permissions);
                await context.SaveChangesAsync();

                // Assign all permissions to ADMIN role
                var adminRole = await context.Roles.FirstOrDefaultAsync(r => r.Name == "ADMIN");
                if (adminRole == null)
                {
                    adminRole = new Aurora.Domain.Entities.Security.Role("ADMIN", "Administrator");
                    context.Roles.Add(adminRole);
                }
                
                adminRole.SetPermissions(permissions);
                await context.SaveChangesAsync();
            }
        }
    }
}
