using System;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using Aurora.Application.Interfaces.Services;
using Aurora.Domain.Entities.CRM;
using Aurora.Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;

namespace Aurora.Infrastructure.Services
{
    public class EmailPollingBackgroundService : BackgroundService
    {
        private readonly IServiceScopeFactory _scopeFactory;
        private readonly ILogger<EmailPollingBackgroundService> _logger;
        // Interval: Every 5 seconds for fast testing
        private readonly TimeSpan _checkInterval = TimeSpan.FromSeconds(5);

        public EmailPollingBackgroundService(
            IServiceScopeFactory scopeFactory,
            ILogger<EmailPollingBackgroundService> logger)
        {
            _scopeFactory = scopeFactory;
            _logger = logger;
        }

        protected override async Task ExecuteAsync(CancellationToken stoppingToken)
        {
            _logger.LogInformation("Email Polling Service Started.");

            while (!stoppingToken.IsCancellationRequested)
            {
                try
                {
                    await ProcessEmailsAsync();
                }
                catch (Exception ex)
                {
                    _logger.LogError(ex, "Error processing newly received emails.");
                }

                await Task.Delay(_checkInterval, stoppingToken);
            }
        }

        private async Task ProcessEmailsAsync()
        {
            using var scope = _scopeFactory.CreateScope();
            var imapService = scope.ServiceProvider.GetRequiredService<IImapService>();
            var dbContext = scope.ServiceProvider.GetRequiredService<AuroraDbContext>();

            _logger.LogInformation("Polling for new emails...");
            var messages = await imapService.GetUnprocessedEmailsAsync();
            _logger.LogInformation($"Found {messages.Count} new emails.");

            if (messages.Any())
            {
                foreach (var msg in messages)
                {
                    // Check if interaction already exists (by MessageId)
                    // If your IMAP provider reuses MessageIds or it's empty, rely on body hash or timestamp.
                    // Assuming MessageId is reliable.
                    if (!string.IsNullOrEmpty(msg.MessageId))
                    {
                         var exists = await dbContext.LeadInteractions.AnyAsync(i => i.MessageId == msg.MessageId);
                         if (exists)
                         {
                             _logger.LogInformation($"Skipping duplicate email: {msg.MessageId}");
                             continue;
                         }
                    }

                    // Check if lead exists by email
                    var lead = await dbContext.Leads
                        .Include(l => l.Interactions)
                        .FirstOrDefaultAsync(l => l.Email == msg.From);

                    if (lead != null)
                    {
                        // Append interaction
                        var interaction = new LeadInteraction(
                            lead.Id, 
                            InteractionType.IncomingEmail, 
                            msg.Body, 
                            msg.Date, 
                            msg.MessageId
                        );
                        // explicit add to ensure EF tracks it as Added
                        await dbContext.LeadInteractions.AddAsync(interaction);
                        lead.AddInteraction(interaction);
                        _logger.LogInformation($"Added interaction to existing lead: {lead.Title}");
                    }
                    else
                    {
                        // Create new Lead
                        var contactName = msg.From.Split('@')[0]; 
                        
                        var newLead = new Lead(
                            title: msg.Subject,
                            source: "Email: " + msg.From,
                            contactName: contactName,
                            email: msg.From,
                            companyName: "Unknown"
                        );

                        // Add lead first
                        await dbContext.Leads.AddAsync(newLead);
                        
                        var interaction = new LeadInteraction(
                            newLead.Id, 
                            InteractionType.IncomingEmail, 
                            msg.Body, 
                            msg.Date, 
                            msg.MessageId
                        );
                        
                        // Explicit add interaction
                        await dbContext.LeadInteractions.AddAsync(interaction);
                        newLead.AddInteraction(interaction);
                        
                        _logger.LogInformation($"Created new lead from email: {msg.Subject}");
                    }
                }
                await dbContext.SaveChangesAsync();
            }
        }
    }
}
