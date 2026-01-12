using Aurora.Domain.Entities.Organization;
using Aurora.Domain.Entities.CRM;
using Aurora.Domain.Entities.Logistics;
using Aurora.Domain.Entities.Sales;
using Microsoft.EntityFrameworkCore;

namespace Aurora.Infrastructure.Persistence
{
    public class AuroraDbContext : DbContext
    {
        public AuroraDbContext(DbContextOptions<AuroraDbContext> options) : base(options)
        {
        }

        // Organization
        public DbSet<GrupoEmpresarial> GruposEmpresariais { get; set; }
        public DbSet<Empresa> Empresas { get; set; }
        public DbSet<Filial> Filiais { get; set; }
        public DbSet<Deposito> Depositos { get; set; }
        public DbSet<LocalEstoque> LocaisEstoque { get; set; }
        public DbSet<CentroCusto> CentrosCusto { get; set; }
        public DbSet<CentroLucro> CentrosLucro { get; set; }

        // Commercial
        public DbSet<Aurora.Domain.Entities.BusinessPartners.BusinessPartner> BusinessPartners { get; set; }
        public DbSet<Aurora.Domain.Entities.CRM.Lead> Leads { get; set; }
        public DbSet<Aurora.Domain.Entities.CRM.Opportunity> Opportunities { get; set; }

        // Logistics
        public DbSet<Material> Materials { get; set; }
        public DbSet<StockLevel> StockLevels { get; set; }
        public DbSet<StockMovement> StockMovements { get; set; }
        public DbSet<Delivery> Deliveries { get; set; }

        // Sales
        public DbSet<SalesQuote> SalesQuotes { get; set; }
        public DbSet<SalesOrder> SalesOrders { get; set; }
        public DbSet<SalesContract> SalesContracts { get; set; }
        public DbSet<SalesContractItem> SalesContractItems { get; set; }



        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);
            
            // Apply all configurations from the current assembly
            modelBuilder.ApplyConfigurationsFromAssembly(typeof(AuroraDbContext).Assembly);
        }
    }
}
