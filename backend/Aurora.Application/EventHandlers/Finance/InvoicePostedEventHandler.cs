using Aurora.Application.Events.Finance;
using Aurora.Application.Interfaces.Events;
using Aurora.Application.Interfaces.Services;
using Aurora.Application.Interfaces.Fiscal;
using Aurora.Domain.Models;
using System.Threading.Tasks;

namespace Aurora.Application.EventHandlers.Finance
{
    public class InvoicePostedEventHandler : IIntegrationEventHandler<InvoicePostedEvent>
    {
        private readonly IFiscalService _fiscalService;

        public InvoicePostedEventHandler(IFiscalService fiscalService)
        {
            _fiscalService = fiscalService;
        }

        public async Task Handle(InvoicePostedEvent @event)
        {
            try
            {
                // Instead of sending email here, we trigger fiscal emission.
                // FiscalService will handle sending the email WITH the PDF attachment once authorized.
                await _fiscalService.EmitirNotaFiscalAsync(@event.InvoiceId);
            }
            catch (System.Exception ex)
            {
                // Log but don't break the event bus
                System.Console.WriteLine($"[InvoicePostedEventHandler] Error triggering fiscal emission: {ex.Message}");
            }
        }
    }
}
