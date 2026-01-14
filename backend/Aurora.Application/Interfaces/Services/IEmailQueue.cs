using System.Threading;
using System.Threading.Tasks;
using Aurora.Domain.Models;

namespace Aurora.Application.Interfaces.Services
{
    public interface IEmailQueue
    {
        ValueTask EnqueueAsync(EmailMessage message, CancellationToken cancellationToken = default);
        ValueTask<EmailMessage> DequeueAsync(CancellationToken cancellationToken = default);
    }
}
