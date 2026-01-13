using System;
using System.Linq;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using System.Reflection;

namespace Aurora.API.Controllers.System
{
    [ApiController]
    [Route("api/system")]
    public class SystemController : ControllerBase
    {
        private readonly IConfiguration _configuration;

        public SystemController(IConfiguration configuration)
        {
            _configuration = configuration;
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
    }
}
