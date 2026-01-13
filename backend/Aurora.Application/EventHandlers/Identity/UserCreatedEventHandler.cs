using Aurora.Application.Events.Identity;
using Aurora.Application.Interfaces.Events;
using Aurora.Application.Interfaces.Communication;
using System.Threading.Tasks;

namespace Aurora.Application.EventHandlers.Identity
{
    public class UserCreatedEventHandler : IIntegrationEventHandler<UserCreatedEvent>
    {
        private readonly INotificationService _notificationService;

        public UserCreatedEventHandler(INotificationService notificationService)
        {
            _notificationService = notificationService;
        }

        public async Task Handle(UserCreatedEvent @event)
        {
            await _notificationService.SendToAllAsync(
                $"Novo usuário cadastrado: {@event.Username} ({@event.Email})", 
                "success"
            );
        }
    }
}
