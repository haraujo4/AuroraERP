using System.Threading.Tasks;

namespace Aurora.Application.Interfaces.Services
{
    public interface IPdfService
    {
        byte[] GenerateSalesQuotePdf(Aurora.Application.DTOs.Sales.SalesQuoteDto quote, Aurora.Domain.Entities.Organization.Empresa company);
    }
}
