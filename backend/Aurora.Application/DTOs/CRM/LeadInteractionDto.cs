using System;

namespace Aurora.Application.DTOs.CRM
{
    public class LeadInteractionDto
    {
        public Guid Id { get; set; }
        public string Type { get; set; } // IncomingEmail, OutgoingEmail, etc.
        public string Body { get; set; }
        public DateTime SentAt { get; set; }
    }
}
