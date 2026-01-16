using Aurora.Domain.Entities.Organization;
using Aurora.Domain.Entities.CRM;
using Aurora.Domain.Entities.Logistics;
using Aurora.Domain.Entities.Sales;
using Aurora.Domain.Entities.Finance;
using Aurora.Domain.Entities.Production;
using Aurora.Domain.Entities.Security;
using Aurora.Domain.Entities.Communication;
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
        public DbSet<Batch> Batches { get; set; }
        public DbSet<StockLevel> StockLevels { get; set; }
        public DbSet<StockMovement> StockMovements { get; set; }
        public DbSet<Delivery> Deliveries { get; set; }
        public DbSet<InventoryDocument> InventoryDocuments { get; set; }
        public DbSet<InventoryDocumentItem> InventoryDocumentItems { get; set; }

        // Sales
        public DbSet<SalesQuote> SalesQuotes { get; set; }
        public DbSet<SalesOrder> SalesOrders { get; set; }
        public DbSet<SalesContract> SalesContracts { get; set; }
        public DbSet<SalesContractItem> SalesContractItems { get; set; }
        public DbSet<PriceList> PriceLists { get; set; }
        public DbSet<PriceListItem> PriceListItems { get; set; }
        public DbSet<DiscountRule> DiscountRules { get; set; }

        // Finance
        public DbSet<Account> Accounts { get; set; }
        public DbSet<JournalEntry> JournalEntries { get; set; }
        public DbSet<JournalEntryLine> JournalEntryLines { get; set; }
        public DbSet<Invoice> Invoices { get; set; }
        public DbSet<InvoiceItem> InvoiceItems { get; set; }
        public DbSet<Payment> Payments { get; set; }
        
        // Production
        public DbSet<WorkCenter> WorkCenters { get; set; }
        public DbSet<BillOfMaterial> BillOfMaterials { get; set; }
        public DbSet<BillOfMaterialItem> BillOfMaterialItems { get; set; }
        public DbSet<ProductionOrder> ProductionOrders { get; set; }
        public DbSet<ProductionOrderComponent> ProductionOrderComponents { get; set; }

        // Purchasing
        public DbSet<Aurora.Domain.Entities.Purchasing.PurchaseRequisition> PurchaseRequisitions { get; set; }
        public DbSet<Aurora.Domain.Entities.Purchasing.PurchaseRequisitionItem> PurchaseRequisitionItems { get; set; }
        public DbSet<Aurora.Domain.Entities.Purchasing.PurchaseOrder> PurchaseOrders { get; set; }
        public DbSet<Aurora.Domain.Entities.Purchasing.PurchaseOrderItem> PurchaseOrderItems { get; set; }

        // Human Resources
        public DbSet<Aurora.Domain.Entities.HR.Department> Departments { get; set; }
        public DbSet<Aurora.Domain.Entities.HR.JobTitle> JobTitles { get; set; }
        public DbSet<Aurora.Domain.Entities.HR.Employee> Employees { get; set; }

        // Fiscal
        public DbSet<Aurora.Domain.Entities.Fiscal.TaxRule> TaxRules { get; set; }
        public DbSet<Aurora.Domain.Entities.Fiscal.FiscalDocument> FiscalDocuments { get; set; }

        // Security
        public DbSet<User> Users { get; set; }
        public DbSet<Role> Roles { get; set; }
        public DbSet<AuditLog> AuditLogs { get; set; }
        public DbSet<EmailLog> EmailLogs { get; set; }

        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
            // Interceptor registration is usually done in DI, but keeping this for awareness
            base.OnConfiguring(optionsBuilder);
        }


        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);
            
            // Apply all configurations from the current assembly
            modelBuilder.ApplyConfigurationsFromAssembly(typeof(AuroraDbContext).Assembly);
        }
    }
}
