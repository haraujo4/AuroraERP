using System;
using System.Threading;
using System.Threading.Tasks;
using Aurora.Application.Interfaces.Services;
using Aurora.Domain.Models;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;

namespace Aurora.Infrastructure.Services
{
    public class EmailBackgroundService : BackgroundService
    {
        private readonly IEmailQueue _queue;
        private readonly IServiceScopeFactory _scopeFactory;
        private readonly ILogger<EmailBackgroundService> _logger;

        public EmailBackgroundService(
            IEmailQueue queue,
            IServiceScopeFactory scopeFactory,
            ILogger<EmailBackgroundService> logger)
        {
            _queue = queue;
            _scopeFactory = scopeFactory;
            _logger = logger;
        }

        protected override async Task ExecuteAsync(CancellationToken stoppingToken)
        {
            _logger.LogInformation("Email Background Service is starting.");

            while (!stoppingToken.IsCancellationRequested)
            {
                try
                {
                    var message = await _queue.DequeueAsync(stoppingToken);

                    _logger.LogInformation($"[Worker] Processing email to {message.To}");

                    using (var scope = _scopeFactory.CreateScope())
                    {
                        var emailService = scope.ServiceProvider.GetRequiredService<IEmailService>();
                        try
                        {
                            await emailService.SendEmailAsync(message);
                            _logger.LogInformation($"[Worker] Email sent to {message.To}");
                        }
                        catch (Exception ex)
                        {
                            _logger.LogError(ex, $"[Worker] Failed to send email to {message.To}");
                        }
                    }
                }
                catch (OperationCanceledException)
                {
                    // Graceful shutdown
                    break;
                }
                catch (Exception ex)
                {
                    _logger.LogError(ex, "[Worker] Error processing email queue.");
                }
            }

            _logger.LogInformation("Email Background Service is stopping.");
        }
    }
}
