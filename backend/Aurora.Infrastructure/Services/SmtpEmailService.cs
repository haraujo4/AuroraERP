using System;
using System.Threading.Tasks;
using Aurora.Application.Interfaces.Services;
using Aurora.Domain.Entities.Communication;
using Aurora.Domain.Models;

using Aurora.Infrastructure.Persistence;
using MailKit.Net.Smtp;
using MailKit.Security;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using MimeKit;

namespace Aurora.Infrastructure.Services
{
    public class SmtpEmailService : IEmailService
    {
        private readonly AuroraDbContext _context;
        private readonly IConfiguration _configuration;

        public SmtpEmailService(AuroraDbContext context, IConfiguration configuration)
        {
            _context = context;
            _configuration = configuration;
        }

        public async Task SendEmailAsync(EmailMessage message)
        {
            var emailLog = new EmailLog
            {
                Recipient = message.To,
                Subject = message.Subject,
                Body = message.Body?.Length > 5000 ? message.Body.Substring(0, 5000) + "..." : message.Body,
                Status = "Pending",
                SentAt = null,
                RetryCount = 0,
                ErrorMessage = "" // DB requires NOT NULL
            };

            await _context.EmailLogs.AddAsync(emailLog);
            await _context.SaveChangesAsync();

            try
            {
                var email = new MimeMessage();
                var senderEmail = _configuration["EmailSettings:SenderEmail"];
                var senderName = _configuration["EmailSettings:SenderName"] ?? "Aurora ERP";
                
                email.From.Add(new MailboxAddress(senderName, senderEmail));
                email.To.Add(MailboxAddress.Parse(message.To));
                email.Subject = message.Subject;

                var builder = new BodyBuilder();
                if (message.IsHtml)
                {
                    builder.HtmlBody = message.Body;
                }
                else
                {
                    builder.TextBody = message.Body;
                }
                if (message.Attachments != null && message.Attachments.Any())
                {
                    foreach (var attachment in message.Attachments)
                    {
                        builder.Attachments.Add(attachment.FileName, attachment.Content, ContentType.Parse(attachment.ContentType));
                    }
                }

                email.Body = builder.ToMessageBody();

                using var smtp = new SmtpClient();
                var host = _configuration["EmailSettings:Host"] ?? "smtp.hostinger.com";
                var port = int.Parse(_configuration["EmailSettings:Port"] ?? "587");
                var password = _configuration["EmailSettings:Password"];

                await smtp.ConnectAsync(host, port, SecureSocketOptions.StartTls);
                await smtp.AuthenticateAsync(senderEmail, password);
                await smtp.SendAsync(email);
                await smtp.DisconnectAsync(true);

                emailLog.Status = "Sent";
                emailLog.SentAt = DateTime.UtcNow;
                _context.EmailLogs.Update(emailLog);
                await _context.SaveChangesAsync();
            }
            catch (Exception ex)
            {
                emailLog.Status = "Failed";
                emailLog.ErrorMessage = ex.Message;
                _context.EmailLogs.Update(emailLog);
                await _context.SaveChangesAsync();
                // Optionally rethrow or handle silently depending on requirement. 
                // Documentation says "Falha de e-mail não pode quebrar processo crítico", so we log and swallow?
                // The implementation plan says "Log of success or failure", implying we capture it here.
                Console.WriteLine($"[Email Service Error] {ex.Message}");
            }
        }
    }
}
