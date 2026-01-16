using System;

namespace Aurora.Domain.Models
{
    public class IncomingEmailMessage
    {
        public string From { get; set; } // Sender's email
        public string Subject { get; set; }
        public string Body { get; set; }
        public DateTime Date { get; set; }
        public string MessageId { get; set; }
    }
}
