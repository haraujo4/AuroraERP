using Aurora.Application.Interfaces.Events;
using System;

namespace Aurora.Application.Events.Identity
{
    public class UserCreatedEvent : IIntegrationEvent
    {
        public Guid Id { get; } = Guid.NewGuid();
        public DateTime OccurredOn { get; } = DateTime.Now;
        public string Username { get; }
        public string Email { get; }

        public UserCreatedEvent(string username, string email)
        {
            Username = username;
            Email = email;
        }
    }
}
