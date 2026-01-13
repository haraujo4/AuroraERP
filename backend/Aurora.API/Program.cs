using Aurora.Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using System.Text;

var builder = WebApplication.CreateBuilder(args);

// Fix for Npgsql 6.0+ DateTime changes
AppContext.SetSwitch("Npgsql.EnableLegacyTimestampBehavior", true);

// Add services to the container.
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();
builder.Services.AddHttpContextAccessor();

// JWT Configuration
var jwtKey = builder.Configuration["Jwt:Key"] ?? "default_secret_key_which_is_not_safe";
builder.Services.AddAuthentication(options =>
{
    options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
})
.AddJwtBearer(options =>
{
    options.TokenValidationParameters = new TokenValidationParameters
    {
        ValidateIssuer = true,
        ValidateAudience = true,
        ValidateLifetime = true,
        ValidateIssuerSigningKey = true,
        ValidIssuer = builder.Configuration["Jwt:Issuer"],
        ValidAudience = builder.Configuration["Jwt:Audience"],
        IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtKey))
    };
});

builder.Services.AddAuthorization();

// Application Services
builder.Services.AddScoped<Aurora.Application.Interfaces.Organization.IGrupoEmpresarialService, Aurora.Application.Services.Organization.GrupoEmpresarialService>();
builder.Services.AddScoped<Aurora.Application.Interfaces.Organization.IEmpresaService, Aurora.Application.Services.Organization.EmpresaService>();
builder.Services.AddScoped<Aurora.Application.Interfaces.Organization.IFilialService, Aurora.Application.Services.Organization.FilialService>();
builder.Services.AddScoped<Aurora.Application.Interfaces.BusinessPartners.IBusinessPartnerService, Aurora.Application.Services.BusinessPartners.BusinessPartnerService>();
builder.Services.AddScoped<Aurora.Application.Interfaces.CRM.ILeadService, Aurora.Application.Services.CRM.LeadService>();
builder.Services.AddScoped<Aurora.Application.Interfaces.CRM.IOpportunityService, Aurora.Application.Services.CRM.OpportunityService>();
builder.Services.AddScoped<Aurora.Application.Interfaces.Logistics.IMaterialService, Aurora.Application.Services.Logistics.MaterialService>();
builder.Services.AddScoped<Aurora.Application.Interfaces.Sales.ISalesQuoteService, Aurora.Application.Services.Sales.SalesQuoteService>();
builder.Services.AddScoped<Aurora.Application.Interfaces.Sales.ISalesOrderService, Aurora.Application.Services.Sales.SalesOrderService>();
builder.Services.AddScoped<Aurora.Application.Interfaces.Sales.ISalesContractService, Aurora.Application.Services.Sales.SalesContractService>();
builder.Services.AddScoped<Aurora.Application.Interfaces.Sales.IPricingService, Aurora.Application.Services.Sales.PricingService>();
// Finance Services
builder.Services.AddScoped<Aurora.Application.Interfaces.Finance.IAccountService, Aurora.Application.Services.Finance.AccountService>();
builder.Services.AddScoped<Aurora.Application.Interfaces.Finance.IJournalEntryService, Aurora.Application.Services.Finance.JournalEntryService>();
builder.Services.AddScoped<Aurora.Application.Interfaces.Finance.IInvoiceService, Aurora.Application.Services.Finance.InvoiceService>();
builder.Services.AddScoped<Aurora.Application.Interfaces.Finance.IPaymentService, Aurora.Application.Services.Finance.PaymentService>();
builder.Services.AddScoped<Aurora.Application.Interfaces.Production.IProductionService, Aurora.Application.Services.Production.ProductionService>();
// Purchasing Services
builder.Services.AddScoped<Aurora.Application.Interfaces.Purchasing.IPurchasingService, Aurora.Application.Services.Purchasing.PurchasingService>();
// Planning Services
builder.Services.AddScoped<Aurora.Application.Interfaces.Planning.IMRPService, Aurora.Application.Services.Planning.MRPService>();
// Communication Services
builder.Services.AddSignalR();
builder.Services.AddSingleton<Aurora.Application.Interfaces.Events.IEventBus, Aurora.Infrastructure.Events.InMemoryEventBus>();
// Communication
builder.Services.AddScoped<Aurora.Application.Interfaces.Communication.INotificationService, Aurora.API.Services.Communication.NotificationService>();

// Fiscal Services
builder.Services.AddScoped<Aurora.Application.Interfaces.Fiscal.ITaxService, Aurora.Application.Services.Fiscal.TaxService>();
builder.Services.AddScoped<Aurora.Application.Interfaces.Fiscal.IFiscalDocumentService, Aurora.Application.Services.Fiscal.FiscalDocumentService>();

// Analytics Services
builder.Services.AddScoped<Aurora.Application.Interfaces.Analytics.IDashboardService, Aurora.Application.Services.Analytics.DashboardService>();
builder.Services.AddScoped<Aurora.Application.Interfaces.Analytics.IProfitabilityService, Aurora.Application.Services.Analytics.ProfitabilityService>();
builder.Services.AddScoped<Aurora.Application.Interfaces.Analytics.IControladoriaService, Aurora.Application.Services.Analytics.ControladoriaService>();

// Logistics Services
builder.Services.AddScoped<Aurora.Application.Interfaces.Logistics.IInventoryService, Aurora.Application.Services.Logistics.InventoryService>();
builder.Services.AddScoped<Aurora.Application.Interfaces.Logistics.IDeliveryService, Aurora.Application.Services.Logistics.DeliveryService>();

// Security Services
builder.Services.AddScoped<Aurora.Application.Interfaces.Security.IAuthService, Aurora.Application.Services.Security.AuthService>();
builder.Services.AddScoped<Aurora.Application.Interfaces.Security.ICurrentUserService, Aurora.API.Services.CurrentUserService>();
builder.Services.AddScoped<Aurora.Application.Interfaces.Security.IUserService, Aurora.Application.Services.Security.UserService>();
builder.Services.AddScoped<Aurora.Infrastructure.Persistence.Interceptors.AuditInterceptor>();

// Core Repositories
builder.Services.AddScoped(typeof(Aurora.Application.Interfaces.Repositories.IRepository<>), typeof(Aurora.Infrastructure.Repositories.Repository<>));
builder.Services.AddScoped<Aurora.Application.Interfaces.Repositories.IProductionRepository, Aurora.Infrastructure.Repositories.Production.ProductionRepository>();
builder.Services.AddScoped<Aurora.Application.Interfaces.Repositories.IGrupoEmpresarialRepository, Aurora.Infrastructure.Repositories.Organization.GrupoEmpresarialRepository>();
builder.Services.AddScoped<Aurora.Application.Interfaces.Repositories.IEmpresaRepository, Aurora.Infrastructure.Repositories.Organization.EmpresaRepository>();
builder.Services.AddScoped<Aurora.Application.Interfaces.Repositories.IFilialRepository, Aurora.Infrastructure.Repositories.Organization.FilialRepository>();
builder.Services.AddScoped<Aurora.Application.Interfaces.Repositories.IBusinessPartnerRepository, Aurora.Infrastructure.Repositories.BusinessPartners.BusinessPartnerRepository>();
builder.Services.AddScoped<Aurora.Application.Interfaces.Repositories.ILeadRepository, Aurora.Infrastructure.Repositories.CRM.LeadRepository>();
builder.Services.AddScoped<Aurora.Application.Interfaces.Repositories.IOpportunityRepository, Aurora.Infrastructure.Repositories.CRM.OpportunityRepository>();
builder.Services.AddScoped<Aurora.Application.Interfaces.Repositories.ISalesQuoteRepository, Aurora.Infrastructure.Repositories.Sales.SalesQuoteRepository>();
builder.Services.AddScoped<Aurora.Application.Interfaces.Repositories.ISalesOrderRepository, Aurora.Infrastructure.Repositories.Sales.SalesOrderRepository>();
builder.Services.AddScoped<Aurora.Application.Interfaces.Repositories.ISalesContractRepository, Aurora.Infrastructure.Repositories.Sales.SalesContractRepository>();
builder.Services.AddScoped<Aurora.Application.Interfaces.Repositories.IPriceListRepository, Aurora.Infrastructure.Repositories.Sales.PriceListRepository>();
builder.Services.AddScoped<Aurora.Application.Interfaces.Repositories.IDiscountRuleRepository, Aurora.Infrastructure.Repositories.Sales.DiscountRuleRepository>();
builder.Services.AddScoped<Aurora.Application.Interfaces.Repositories.Logistics.IDeliveryRepository, Aurora.Infrastructure.Repositories.Logistics.DeliveryRepository>();
// Purchasing Repository
builder.Services.AddScoped<Aurora.Application.Interfaces.Repositories.IPurchasingRepository, Aurora.Infrastructure.Repositories.Purchasing.PurchasingRepository>();
// Fiscal Repository
builder.Services.AddScoped<Aurora.Application.Interfaces.Repositories.ITaxRuleRepository, Aurora.Infrastructure.Repositories.Fiscal.TaxRuleRepository>();
builder.Services.AddScoped<Aurora.Application.Interfaces.Repositories.IFiscalDocumentRepository, Aurora.Infrastructure.Repositories.Fiscal.FiscalDocumentRepository>();
                
// Database Context
builder.Services.AddDbContext<AuroraDbContext>((sp, options) => {
    var interceptor = sp.GetRequiredService<Aurora.Infrastructure.Persistence.Interceptors.AuditInterceptor>();
    options.UseNpgsql(builder.Configuration.GetConnectionString("DefaultConnection"))
           .AddInterceptors(interceptor);
});

// Event Handlers
builder.Services.AddScoped<Aurora.Application.Interfaces.Events.IIntegrationEventHandler<Aurora.Application.Events.Identity.UserCreatedEvent>, Aurora.Application.EventHandlers.Identity.UserCreatedEventHandler>();
builder.Services.AddScoped<Aurora.Application.Interfaces.Events.IIntegrationEventHandler<Aurora.Application.Events.HR.EmployeeAdmittedEvent>, Aurora.Application.EventHandlers.HR.EmployeeAdmittedEventHandler>();

// HR Services
builder.Services.AddScoped<Aurora.Application.Interfaces.HR.IEmployeeService, Aurora.Application.Services.HR.EmployeeService>();

// Fiscal Services
builder.Services.AddScoped<Aurora.Application.Interfaces.Fiscal.ITaxService, Aurora.Application.Services.Fiscal.TaxService>();
builder.Services.AddScoped<Aurora.Application.Interfaces.Fiscal.IFiscalDocumentService, Aurora.Application.Services.Fiscal.FiscalDocumentService>();

// ... (existing code)

builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAll",
        builder =>
        {
            builder.SetIsOriginAllowed(_ => true)
                   .AllowAnyMethod()
                   .AllowAnyHeader()
                   .AllowCredentials();
        });
});

builder.Services.AddControllers()
    .AddJsonOptions(options => 
    {
        options.JsonSerializerOptions.Converters.Add(new System.Text.Json.Serialization.JsonStringEnumConverter());
        options.JsonSerializerOptions.ReferenceHandler = System.Text.Json.Serialization.ReferenceHandler.IgnoreCycles;
    });

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseCors("AllowAll");

app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();
app.MapHub<Aurora.API.Hubs.NotificationHub>("/hubs/notifications");

// Seed initial data
using (var scope = app.Services.CreateScope())
{
    var services = scope.ServiceProvider;
    try 
    {
        await Aurora.Infrastructure.Persistence.DataSeeder.SeedUsersAsync(services);
    }
    catch (Exception ex)
    {
        Console.WriteLine($"An error occurred during seeding: {ex.Message}");
        Console.WriteLine(ex.StackTrace);
    }
}

app.UseHttpsRedirection();

app.Run();
