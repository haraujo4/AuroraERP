using System;
using System.Linq;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using System.Reflection;
using Aurora.Application.Interfaces.Repositories;
using Aurora.Domain.Entities.Finance;
using Aurora.Application.Interfaces.Finance;
using System.Threading.Tasks;

namespace Aurora.API.Controllers.System
{
    [ApiController]
    [Route("api/system")]
    public class SystemController : ControllerBase
    {
        private readonly IConfiguration _configuration;
        private readonly IRepository<Invoice> _invoiceRepository;
        private readonly IJournalEntryService _journalEntryService;

        public SystemController(
            IConfiguration configuration,
            IRepository<Invoice> invoiceRepository,
            IJournalEntryService journalEntryService)
        {
            _configuration = configuration;
            _invoiceRepository = invoiceRepository;
            _journalEntryService = journalEntryService;
        }

        [HttpGet("info")]
        public IActionResult GetSystemInfo()
        {
            var connectionString = _configuration.GetConnectionString("DefaultConnection");
            var dbName = "Unknown";

            if (!string.IsNullOrEmpty(connectionString))
            {
                // Simple parsing for PostgreSQL connection string
                var parts = connectionString.Split(';');
                var dbPart = parts.FirstOrDefault(p => p.Trim().StartsWith("Database=", StringComparison.OrdinalIgnoreCase));
                if (dbPart != null)
                {
                    dbName = dbPart.Split('=')[1].Trim();
                }
            }

            return Ok(new
            {
                serverName = Environment.MachineName,
                databaseName = dbName,
                version = Assembly.GetExecutingAssembly().GetName().Version?.ToString() ?? "1.0.0",
                environment = Environment.GetEnvironmentVariable("ASPNETCORE_ENVIRONMENT") ?? "Production"
            });
        }
        [HttpGet("debug/last-invoice-je")]
        public async Task<IActionResult> GetLastInvoiceDebug()
        {
            try
            {
                var invoices = await _invoiceRepository.GetAllAsync();
                var lastInvoice = invoices.OrderByDescending(i => i.IssueDate).FirstOrDefault();

                if (lastInvoice == null) return Ok("No invoices found");

                var je = await _journalEntryService.GetByReferenceAsync(lastInvoice.Number) 
                      ?? await _journalEntryService.GetByReferenceAsync(lastInvoice.Id.ToString());

                if (je == null) return Ok(new { 
                    InvoiceNumber = lastInvoice.Number, 
                    InvoiceId = lastInvoice.Id, 
                    Message = "Journal Entry NOT FOUND for this invoice" 
                });

                return Ok(new
                {
                    InvoiceNumber = lastInvoice.Number,
                    InvoiceId = lastInvoice.Id,
                    JournalEntryId = je.Id,
                    Lines = je.Lines.Select(l => new 
                    {
                        // l.Id is not on DTO? Then skip or use index.
                         Account = l.AccountName,
                        l.Amount,
                        l.Type,
                        BusinessPartnerId = l.BusinessPartnerId,
                        BusinessPartnerName = l.BusinessPartnerName
                    })
                });
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }
    }
}
