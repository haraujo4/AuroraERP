using Aurora.Application.Events.Sales;
using Aurora.Application.Interfaces.Events;
using Aurora.Application.Interfaces.Services;
using Aurora.Domain.Models;
using System.Threading.Tasks;

namespace Aurora.Application.EventHandlers.Sales
{
    public class SalesQuoteApprovedEventHandler : IIntegrationEventHandler<SalesQuoteApprovedEvent>
    {
        private readonly IEmailService _emailService;

        public SalesQuoteApprovedEventHandler(IEmailService emailService)
        {
            _emailService = emailService;
        }

        public async Task Handle(SalesQuoteApprovedEvent @event)
        {
            if (string.IsNullOrEmpty(@event.CustomerEmail)) return;

            var emailMsg = new EmailMessage
            {
                To = @event.CustomerEmail,
                Subject = $"Cotação Aprovada - Aurora ERP",
                Body = $@"
                    <h1>Prezado(a) {@event.CustomerName},</h1>
                    <p>Sua cotação foi <strong>APROVADA</strong> com sucesso!</p>
                    <p><strong>Valor Total:</strong> {@event.TotalValue:C}</p>
                    <p>Em breve você receberá os detalhes do pedido.</p>
                    <br>
                    <p>Atenciosamente,<br>Equipe de Vendas Aurora</p>",
                IsHtml = true
            };

            await _emailService.SendEmailAsync(emailMsg);
        }
    }
}
