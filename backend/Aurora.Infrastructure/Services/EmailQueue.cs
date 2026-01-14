using System.Threading;
using System.Threading.Channels;
using System.Threading.Tasks;
using Aurora.Application.Interfaces.Services;
using Aurora.Domain.Models;

namespace Aurora.Infrastructure.Services
{
    public class EmailQueue : IEmailQueue
    {
        private readonly Channel<EmailMessage> _queue;

        public EmailQueue()
        {
            // Bounded channel to prevent memory leaks if consumer is slow
            var options = new BoundedChannelOptions(100)
            {
                FullMode = BoundedChannelFullMode.Wait
            };
            _queue = Channel.CreateBounded<EmailMessage>(options);
        }

        public async ValueTask EnqueueAsync(EmailMessage message, CancellationToken cancellationToken = default)
        {
            await _queue.Writer.WriteAsync(message, cancellationToken);
        }

        public async ValueTask<EmailMessage> DequeueAsync(CancellationToken cancellationToken = default)
        {
            return await _queue.Reader.ReadAsync(cancellationToken);
        }
    }
}
