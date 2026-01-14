using System.Threading.Tasks;
using Aurora.Domain.Models;

namespace Aurora.Application.Interfaces.Services
{
    public interface IEmailService
    {
        Task SendEmailAsync(EmailMessage message);
    }
}
