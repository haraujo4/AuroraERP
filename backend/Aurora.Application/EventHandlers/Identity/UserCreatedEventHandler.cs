using Aurora.Application.Events.Identity;
using Aurora.Application.Interfaces.Events;
using Aurora.Application.Interfaces.Communication;
using Aurora.Application.Interfaces.Services;
using Aurora.Domain.Models;
using System.Threading.Tasks;

namespace Aurora.Application.EventHandlers.Identity
{
    public class UserCreatedEventHandler : IIntegrationEventHandler<UserCreatedEvent>
    {
        private readonly INotificationService _notificationService;
        private readonly IEmailService _emailService;

        public UserCreatedEventHandler(INotificationService notificationService, IEmailService emailService)
        {
            _notificationService = notificationService;
            _emailService = emailService;
        }

        public async Task Handle(UserCreatedEvent @event)
        {
            // Send In-App Notification
            await _notificationService.SendToAllAsync(
                $"Novo usuário cadastrado: {@event.Username} ({@event.Email})", 
                "success"
            );

            // Send Email
            var emailMsg = new EmailMessage
            {
                To = @event.Email,
                Subject = "Bem-vindo ao Aurora ERP",
                Body = $@"
                    <h1>Olá, {@event.Username}!</h1>
                    <p>Sua conta no <strong>Aurora ERP</strong> foi criada com sucesso.</p>
                    <p>Você já pode acessar o sistema utilizando seu e-mail.</p>
                    <br>
                    <p>Atenciosamente,<br>Equipe Aurora</p>",
                IsHtml = true
            };

            await _emailService.SendEmailAsync(emailMsg);
        }
    }
}
