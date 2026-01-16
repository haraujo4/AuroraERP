using System;
using Aurora.Domain.Common;

namespace Aurora.Domain.Entities.CRM
{
    public enum InteractionType
    {
        IncomingEmail,
        OutgoingEmail,
        Note,
        Call
    }

    public class LeadInteraction : BaseEntity
    {
        public Guid LeadId { get; private set; }
        public InteractionType Type { get; private set; }
        public string Body { get; private set; } = string.Empty;
        public DateTime SentAt { get; private set; }
        public string? MessageId { get; private set; } // Email Message-ID for threading

        // EF Core Navigation
        public virtual Lead Lead { get; set; } = null!;

        private LeadInteraction() { }

        public LeadInteraction(Guid leadId, InteractionType type, string body, DateTime sentAt, string? messageId = null)
        {
            LeadId = leadId;
            Type = type;
            Body = body;
            SentAt = sentAt;
            MessageId = messageId;
        }
    }
}
