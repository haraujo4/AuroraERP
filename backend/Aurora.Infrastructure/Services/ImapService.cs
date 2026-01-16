using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Aurora.Application.Interfaces.Services;
using Aurora.Domain.Models;
using MailKit;
using MailKit.Net.Imap;
using MailKit.Search;
using MailKit.Security;
using Microsoft.Extensions.Configuration;
using MimeKit;

namespace Aurora.Infrastructure.Services
{
    public class ImapService : IImapService
    {
        private readonly IConfiguration _configuration;

        public ImapService(IConfiguration configuration)
        {
            _configuration = configuration;
        }

        public async Task<List<IncomingEmailMessage>> GetUnprocessedEmailsAsync()
        {
            var messages = new List<IncomingEmailMessage>();

            try
            {
                using var client = new ImapClient();
                var host = _configuration["EmailSettings:Host"] ?? "smtp.hostinger.com"; // Usually same host or imap.host
                // Adjust if IMAP host is different, often it is imap.domain
                // For now assuming same as SMTP host but checking config is better.
                // Or "imap.hostinger.com" if provider specific.
                // Let's assume standard IMAP port 993 (SSL).
                
                var imapHost = _configuration["EmailSettings:ImapHost"] ?? host.Replace("smtp.", "imap."); 
                var port = int.Parse(_configuration["EmailSettings:ImapPort"] ?? "993");
                var email = _configuration["EmailSettings:SenderEmail"];
                var password = _configuration["EmailSettings:Password"];

                await client.ConnectAsync(imapHost, port, SecureSocketOptions.SslOnConnect);
                await client.AuthenticateAsync(email, password);

                var inbox = client.Inbox;
                await inbox.OpenAsync(FolderAccess.ReadWrite);

                // Initialize search query: All emails, but limited to recent?
                // Fetching ALL every 5 seconds is bad.
                // Let's fetch emails delivered since yesterday to catch up, assuming duplication check handles the rest.
                var query = SearchQuery.DeliveredAfter(DateTime.Today.AddDays(-1));
                var uids = await inbox.SearchAsync(query);

                foreach (var uid in uids)
                {
                    var message = await inbox.GetMessageAsync(uid);
                    
                    messages.Add(new IncomingEmailMessage
                    {
                        From = message.From.Mailboxes.FirstOrDefault()?.Address ?? "unknown",
                        Subject = message.Subject,
                        Body = CleanEmailBody(!string.IsNullOrEmpty(message.TextBody) ? message.TextBody : message.HtmlBody),
                        Date = message.Date.DateTime,
                        MessageId = message.MessageId
                    });

                    // Mark as seen (read) -- OPTIONAL now since we track by ID
                    // await inbox.AddFlagsAsync(uid, MessageFlags.Seen, true);
                }

                await client.DisconnectAsync(true);
            }
            catch (Exception ex)
            {
                Console.WriteLine($"[IMAP Error] {ex.Message}");
                // Handle connection errors gracefully
            }

            return messages;
        }

        private string CleanEmailBody(string body)
        {
            if (string.IsNullOrEmpty(body))
                return string.Empty;

            // Normalize line endings
            body = body.Replace("\r\n", "\n").Replace("\r", "\n");

            // Remove HTML tags if it looks like HTML (basic strip)
            // Note: If TextBody was null, we might have HTML content here.
            // A simple way to check is if it contains tags.
            if (body.Contains("<") && body.Contains(">"))
            {
                body = System.Text.RegularExpressions.Regex.Replace(body, "<.*?>", string.Empty);
                // After stripping tags, we might have HTML entities
                body = System.Net.WebUtility.HtmlDecode(body);
            }

            var lines = body.Split('\n');
            var cleanLines = new List<string>();

            // Regex for "On [Date], [Name] wrote:" (English/Portuguese variants)
            // Supports:
            // On ... wrote:
            // Em ... escreveu:
            // On ... sent:
            var replyHeaderRegex = new System.Text.RegularExpressions.Regex(
                @"^(On|Em)\s+.*(wrote|escreveu|sent):?$", 
                System.Text.RegularExpressions.RegexOptions.IgnoreCase | System.Text.RegularExpressions.RegexOptions.Compiled);

            var fromHeaderRegex = new System.Text.RegularExpressions.Regex(
                @"^From:\s+.*$", 
                System.Text.RegularExpressions.RegexOptions.IgnoreCase | System.Text.RegularExpressions.RegexOptions.Compiled);

            foreach (var line in lines)
            {
                var trimmed = line.Trim();
                
                if (string.IsNullOrWhiteSpace(trimmed))
                {
                    cleanLines.Add(line);
                    continue;
                }

                // Check Regex patterns
                if (replyHeaderRegex.IsMatch(trimmed))
                {
                    break;
                }
                
                if (fromHeaderRegex.IsMatch(trimmed)) 
                {
                    // "From: " is a bit dangerous if it's just in the text, but usually signifies a forwarded/quoted block at start of line
                     break;
                }

                // Separator lines
                if (trimmed.StartsWith("-----") || trimmed.StartsWith("________________________________"))
                {
                    break;
                }
                
                // Quoted text
                if (trimmed.StartsWith(">"))
                {
                    break;
                }

                cleanLines.Add(line);
            }

            // Trim end to remove trailing empty lines left before the cut
            return string.Join("\n", cleanLines).TrimEnd();
        }
    }
}
