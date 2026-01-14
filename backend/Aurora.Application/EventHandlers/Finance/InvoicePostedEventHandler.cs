using Aurora.Application.Events.Finance;
using Aurora.Application.Interfaces.Events;
using Aurora.Application.Interfaces.Services;
using Aurora.Domain.Models;
using System.Threading.Tasks;

namespace Aurora.Application.EventHandlers.Finance
{
    public class InvoicePostedEventHandler : IIntegrationEventHandler<InvoicePostedEvent>
    {
        private readonly IEmailService _emailService;

        public InvoicePostedEventHandler(IEmailService emailService)
        {
            _emailService = emailService;
        }

        public async Task Handle(InvoicePostedEvent @event)
        {
            if (string.IsNullOrEmpty(@event.CustomerEmail)) return;

            var emailMsg = new EmailMessage
            {
                To = @event.CustomerEmail,
                Subject = $"Fatura Emitida: {@event.Number} - Aurora ERP",
                Body = $@"
                    <h1>Prezado(a) {@event.CustomerName},</h1>
                    <p>Uma nova fatura foi emitida para sua empresa.</p>
                    <ul>
                        <li><strong>Número:</strong> {@event.Number}</li>
                        <li><strong>Valor:</strong> {@event.Amount:C}</li>
                        <li><strong>Vencimento:</strong> {@event.DueDate:d}</li>
                    </ul>
                    <p>O boleto e a nota fiscal estão disponíveis no portal do cliente.</p>
                    <br>
                    <p>Atenciosamente,<br>Departamento Financeiro Aurora</p>",
                IsHtml = true
            };

            await _emailService.SendEmailAsync(emailMsg);
        }
    }
}
