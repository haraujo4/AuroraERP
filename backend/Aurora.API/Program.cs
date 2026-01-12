using Aurora.Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

// Fix for Npgsql 6.0+ DateTime changes
AppContext.SetSwitch("Npgsql.EnableLegacyTimestampBehavior", true);

// Add services to the container.
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// Application Services
builder.Services.AddScoped<Aurora.Application.Interfaces.Organization.IGrupoEmpresarialService, Aurora.Application.Services.Organization.GrupoEmpresarialService>();
builder.Services.AddScoped<Aurora.Application.Interfaces.Organization.IEmpresaService, Aurora.Application.Services.Organization.EmpresaService>();
builder.Services.AddScoped<Aurora.Application.Interfaces.Organization.IFilialService, Aurora.Application.Services.Organization.FilialService>();
builder.Services.AddScoped<Aurora.Application.Interfaces.BusinessPartners.IBusinessPartnerService, Aurora.Application.Services.BusinessPartners.BusinessPartnerService>();
builder.Services.AddScoped<Aurora.Application.Interfaces.CRM.ILeadService, Aurora.Application.Services.CRM.LeadService>();
builder.Services.AddScoped<Aurora.Application.Interfaces.CRM.ILeadService, Aurora.Application.Services.CRM.LeadService>();
builder.Services.AddScoped<Aurora.Application.Interfaces.CRM.IOpportunityService, Aurora.Application.Services.CRM.OpportunityService>();
builder.Services.AddScoped<Aurora.Application.Interfaces.Logistics.IMaterialService, Aurora.Application.Services.Logistics.MaterialService>();
builder.Services.AddScoped<Aurora.Application.Interfaces.Sales.ISalesQuoteService, Aurora.Application.Services.Sales.SalesQuoteService>();
builder.Services.AddScoped<Aurora.Application.Interfaces.Sales.ISalesOrderService, Aurora.Application.Services.Sales.SalesOrderService>();
builder.Services.AddScoped<Aurora.Application.Interfaces.Sales.ISalesContractService, Aurora.Application.Services.Sales.SalesContractService>();
builder.Services.AddScoped<Aurora.Application.Interfaces.Logistics.IInventoryService, Aurora.Application.Services.Logistics.InventoryService>();
builder.Services.AddScoped<Aurora.Application.Interfaces.Logistics.IDeliveryService, Aurora.Application.Services.Logistics.DeliveryService>();

// Repositories
builder.Services.AddScoped(typeof(Aurora.Application.Interfaces.Repositories.IRepository<>), typeof(Aurora.Infrastructure.Repositories.Repository<>));
builder.Services.AddScoped<Aurora.Application.Interfaces.Repositories.IGrupoEmpresarialRepository, Aurora.Infrastructure.Repositories.Organization.GrupoEmpresarialRepository>();
builder.Services.AddScoped<Aurora.Application.Interfaces.Repositories.IEmpresaRepository, Aurora.Infrastructure.Repositories.Organization.EmpresaRepository>();
builder.Services.AddScoped<Aurora.Application.Interfaces.Repositories.IFilialRepository, Aurora.Infrastructure.Repositories.Organization.FilialRepository>();
builder.Services.AddScoped<Aurora.Application.Interfaces.Repositories.IBusinessPartnerRepository, Aurora.Infrastructure.Repositories.BusinessPartners.BusinessPartnerRepository>();
builder.Services.AddScoped<Aurora.Application.Interfaces.Repositories.ILeadRepository, Aurora.Infrastructure.Repositories.CRM.LeadRepository>();
builder.Services.AddScoped<Aurora.Application.Interfaces.Repositories.ILeadRepository, Aurora.Infrastructure.Repositories.CRM.LeadRepository>();
builder.Services.AddScoped<Aurora.Application.Interfaces.Repositories.IOpportunityRepository, Aurora.Infrastructure.Repositories.CRM.OpportunityRepository>();
builder.Services.AddScoped<Aurora.Application.Interfaces.Repositories.ISalesQuoteRepository, Aurora.Infrastructure.Repositories.Sales.SalesQuoteRepository>();
builder.Services.AddScoped<Aurora.Application.Interfaces.Repositories.ISalesQuoteRepository, Aurora.Infrastructure.Repositories.Sales.SalesQuoteRepository>();
builder.Services.AddScoped<Aurora.Application.Interfaces.Repositories.ISalesOrderRepository, Aurora.Infrastructure.Repositories.Sales.SalesOrderRepository>();
builder.Services.AddScoped<Aurora.Application.Interfaces.Repositories.ISalesContractRepository, Aurora.Infrastructure.Repositories.Sales.SalesContractRepository>();

// Database Context
builder.Services.AddDbContext<AuroraDbContext>(options =>
    options.UseNpgsql(builder.Configuration.GetConnectionString("DefaultConnection")));

builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAll",
        builder =>
        {
            builder.AllowAnyOrigin()
                   .AllowAnyMethod()
                   .AllowAnyHeader();
        });
});

builder.Services.AddControllers()
    .AddJsonOptions(options => 
    {
        options.JsonSerializerOptions.Converters.Add(new System.Text.Json.Serialization.JsonStringEnumConverter());
    });

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseCors("AllowAll");
app.MapControllers();

app.UseHttpsRedirection();

app.Run();
