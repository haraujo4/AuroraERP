using System;
using Aurora.Domain.Common;

namespace Aurora.Domain.Entities.Communication
{
    public class EmailLog : BaseEntity
    {
        public string Recipient { get; set; }
        public string Subject { get; set; }
        public string Body { get; set; } // Can be truncated if too large
        public string Status { get; set; } // "Pending", "Sent", "Failed"
        public DateTime? SentAt { get; set; }
        public string ErrorMessage { get; set; }
        public int RetryCount { get; set; }
    }
}
